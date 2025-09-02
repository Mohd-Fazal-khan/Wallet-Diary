import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { Alert } from "react-native";
import { getCurrencySymbolByLocation } from "./currency";

export const exportTransactionsAsPDF = async (
  filterType,
  startDate,
  endDate
) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "User not logged in.");
      return false;
    }

    const currencySymbol = await getCurrencySymbolByLocation();

    const expensesSnapshot = await getDocs(
      collection(db, "users", user.uid, "expenses")
    );
    const incomeSnapshot = await getDocs(
      collection(db, "users", user.uid, "income")
    );

    const expenses = expensesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        sourceOrItem: data.item || "-",
        category: data.category || "-",
        notes: data.notes || "-",
        amount: data.amount || "0",
        date: data.date || "-",
        type: "Debit",
      };
    });

    const incomes = incomeSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        sourceOrItem: data.source || "-",
        category: "Income",
        notes: data.notes || "-",
        amount: data.salary || "0",
        date: data.date || "-",
        type: "Credit",
      };
    });

    let transactions = [...expenses, ...incomes].filter(
      (t) => t.date && t.date !== "-" && !isNaN(new Date(t.date))
    );

    if (transactions.length === 0) {
      Alert.alert("No Data", "No transactions found.");
      return false;
    }

    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const getTxnDate = (t) => new Date(t.date);
    const isBeforeFilterRange = (t) => {
      const txnDate = getTxnDate(t);
      if (filterType === "today") return txnDate < new Date(todayString);
      if (filterType === "weekly") {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        return txnDate < lastWeek;
      }
      if (filterType === "monthly") {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return txnDate < startOfMonth;
      }
      if (filterType === "custom") return txnDate < startDate;
      return false;
    };

    const openingBalance = transactions
      .filter(isBeforeFilterRange)
      .reduce((total, txn) => {
        const amount = parseFloat(txn.amount) || 0;
        return txn.type === "Credit" ? total + amount : total - amount;
      }, 0);

    if (filterType === "today") {
      transactions = transactions.filter((t) => t.date === todayString);
    } else if (filterType === "weekly") {
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      transactions = transactions.filter((t) => new Date(t.date) >= lastWeek);
    } else if (filterType === "monthly") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      transactions = transactions.filter(
        (t) => new Date(t.date) >= startOfMonth
      );
    } else if (filterType === "custom") {
      transactions = transactions.filter((t) => {
        const txnDate = new Date(t.date);
        return txnDate >= startDate && txnDate <= endDate;
      });
    }

    if (transactions.length === 0) {
      Alert.alert("No Data", "No transactions found for selected filter.");
      return false;
    }

    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    let runningBalance = openingBalance;
    const rowsHTML = transactions
      .map((t, index) => {
        const amount = parseFloat(t.amount) || 0;
        runningBalance += t.type === "Credit" ? amount : -amount;

        return `
          <tr>  
            <td>${index + 1}</td>
            <td>${t.date}</td>
            <td>${t.sourceOrItem}</td>
            <td>${t.category}</td>
            <td>${t.notes}</td>
            <td>${currencySymbol}${amount.toFixed(2)}</td>
            <td>${t.type}</td>
            <td>${currencySymbol}${runningBalance.toFixed(2)}</td>
          </tr>
        `;
      })
      .join("");

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; table-layout: fixed; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: center; word-wrap: break-word; white-space: normal; }
            th { background-color: #2d8bef; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Transaction Report</h1>
          <table>
            <tr>
              <th>S.No.</th>
              <th>Date</th>
              <th>Source/Item</th>
              <th>Category</th>
              <th>Notes</th>
              <th>Amount (${currencySymbol})</th>
              <th>Type</th>
              <th>Balance (${currencySymbol})</th>
            </tr>
            ${rowsHTML}
          </table>

          <p class="total">Final Balance: ${currencySymbol}${runningBalance.toFixed(
      2
    )}</p>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html, base64: false });

    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("PDF Generated", `File saved to: ${uri}`);
    } else {
      await Sharing.shareAsync(uri);
    }

    return true;
  } catch (error) {
    console.error("PDF export failed:", error);
    Alert.alert("Error", "Failed to export PDF.");
    return false;
  }
};

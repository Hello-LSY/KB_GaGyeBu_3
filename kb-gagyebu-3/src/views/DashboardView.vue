<template>
    <div class="dashboard-content container mt-3">
      <div class="row">
        <!-- Left Column: Box + Weekly -->
        <div class="col-md-9 col-12 left-column">
          <div class="row mb-2">
            <div class="col-md-4 col-12 mb-3 box-container">
              <BoxComponent :percentage="totalMonthly.balance.percent" :title="totalMonthly.balance.title" :content="totalMonthly.balance.amount" :pathData="totalMonthly.balance.pathData"/>
            </div>
            <div class="col-md-4 col-12 mb-3 box-container">
              <BoxComponent :percentage="totalMonthly.income.percent" :title="totalMonthly.income.title" :content="totalMonthly.income.amount" :pathData="totalMonthly.income.pathData"/>
            </div>
            <div class="col-md-4 col-12 mb-3 box-container">
              <BoxComponent :percentage="totalMonthly.expenese.percent" :title="totalMonthly.expenese.title" :content="totalMonthly.expenese.amount" :pathData="totalMonthly.expenese.pathData"/>
            </div>
          </div>
          <div class="row">
            <div class="col-12 weekly-spend-container">
              <WeekendComponent :calculateTotalAmount="calculateTotalAmount"/>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-12 category-container">
          <CategoryComponent :filterTransactionsByDate="filterTransactionsByDate" />
        </div>
      </div>
    </div>
</template>

<script setup>
  import BoxComponent from '../components/dashboard/BoxComponent.vue';
  import CategoryComponent from '../components/dashboard/CategoryComponent.vue';
  import WeekendComponent from '../components/dashboard/WeekendComponent.vue';

  import { reactive, onMounted } from 'vue';
  import axios from 'axios';

  const totalMonthly = reactive({
    balance : { 
      percent: "", 
      title: "총 순이익", 
      amount: "0",
      pathData: 'M22 7C22 4.79086 20.2091 3 18 3H6C3.79086 3 2 4.79086 2 7V8.5H6C7.933 8.5 9.5 10.067 9.5 12C9.5 13.933 7.933 15.5 6 15.5H2V17C2 19.2091 3.79086 21 6 21H18C20.2091 21 22 19.2091 22 17V7ZM6 10C7.10457 10 8 10.8954 8 12C8 13.1046 7.10457 14 6 14H2V10H6Z'
    },
    income : { 
      percent: "", 
      title: "총 수입", 
      amount: "0",
      pathData: "M6 4H18C20.2091 4 22 5.79086 22 8V13C22 13.5523 21.5523 14 21 14H18C15.7909 14 14 15.7909 14 18V19C14 19.5523 13.5523 20 13 20H6C3.79086 20 2 18.2091 2 16V8C2 5.79086 3.79086 4 6 4ZM6 7C6.55228 7 7 7.44772 7 8C7 8.55228 6.55228 9 6 9C5.44772 9 5 8.55228 5 8C5 7.44772 5.44772 7 6 7ZM14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12ZM19.75 16C19.75 15.5858 19.4142 15.25 19 15.25C18.5858 15.25 18.25 15.5858 18.25 16V17.25H17C16.5858 17.25 16.25 17.5858 16.25 18C16.25 18.4142 16.5858 18.75 17 18.75H18.25V20C18.25 20.4142 18.5858 20.75 19 20.75C19.4142 20.75 19.75 20.4142 19.75 20V18.75H21C21.4142 18.75 21.75 18.4142 21.75 18C21.75 17.5858 21.4142 17.25 21 17.25H19.75V16Z",
    },
    expenese : { 
      percent: "", 
      title: "총 지출", 
      amount: "0",
      pathData: "M18 3H6C3.79086 3 2 4.79086 2 7C2 8.67869 3.03408 10.1159 4.5 10.7092V7C4.5 6.60218 4.65804 6.22064 4.93934 5.93934C5.22064 5.65804 5.60218 5.5 6 5.5H18C18.3978 5.5 18.7794 5.65804 19.0607 5.93934C19.342 6.22064 19.5 6.60218 19.5 7V10.7092C20.9659 10.1159 22 8.67869 22 7C22 4.79086 20.2091 3 18 3ZM18 19L18 7H6V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19ZM11.25 15.1895L10.5303 14.4698C10.2374 14.1769 9.76256 14.1769 9.46967 14.4698C9.17678 14.7627 9.17678 15.2376 9.46967 15.5305L10.7626 16.8234C11.446 17.5068 12.554 17.5068 13.2374 16.8234L14.5303 15.5305C14.8232 15.2376 14.8232 14.7627 14.5303 14.4698C14.2374 14.1769 13.7626 14.1769 13.4697 14.4698L12.75 15.1895V11.0002C12.75 10.5859 12.4142 10.2502 12 10.2502C11.5858 10.2502 11.25 10.5859 11.25 11.0002V15.1895Z",
    }
  });

  const filterTransactionsByDate = (transactions, year, month) => {
        return transactions.filter(transaction => {
          const transactionDate = new Date(transaction.start);
          const transactionYear = transactionDate.getFullYear();
          const transactionMonth = transactionDate.getMonth() + 1;
          return transactionYear === year && transactionMonth === month;
        });
      }

  const calculateTotalAmount = (transactions, type) => {
        return transactions.reduce((total, transaction) => {
          if (transaction.type === type) {
            return total + parseInt(transaction.amount);
          }
          return total;
    }, 0);
  }

  onMounted(async() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'))
      const userId = userInfo.id
      
      const transactions = await axios.get('http://localhost:3000/transactions')
    
      transactions.data = transactions.data.filter(transaction => transaction.userId === userId);                        

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      const currentMonthTransactions = filterTransactionsByDate(transactions.data, currentYear, currentMonth);
      const prevMonthTransactions = filterTransactionsByDate(transactions.data, prevYear, prevMonth);

      const prevIncomeSum = calculateTotalAmount(prevMonthTransactions, 'income');
      const prevExpenseSum = calculateTotalAmount(prevMonthTransactions, 'expense');
      const incomeSum = calculateTotalAmount(currentMonthTransactions, 'income');
      const expenseSum = calculateTotalAmount(currentMonthTransactions, 'expense');

      // 증감률을 위한 percentage 계산
      const incomeChange = prevIncomeSum !== 0 ? ((incomeSum - prevIncomeSum) / prevIncomeSum) * 100 : 0;
      const expenseChange = prevExpenseSum !== 0 ? ((expenseSum - prevExpenseSum) / prevExpenseSum) * 100 : 0;
      const prevIncomeExpenseDiff = prevIncomeSum - prevExpenseSum;
      const balanceChange = prevIncomeExpenseDiff !== 0 ? ((incomeSum - expenseSum - prevIncomeExpenseDiff) / prevIncomeExpenseDiff) * 100 : 0;

      totalMonthly.income.amount = incomeSum.toLocaleString();
      totalMonthly.expenese.amount = expenseSum.toLocaleString();
      totalMonthly.balance.amount = (incomeSum - expenseSum).toLocaleString();
      totalMonthly.income.percent = incomeChange.toFixed(1);
      totalMonthly.expenese.percent = expenseChange.toFixed(1);
      totalMonthly.balance.percent = balanceChange.toFixed(1);

    } catch(e){
      console.log(e)
    }
  });
</script>

<style scoped>
  .dashboard-content {
    flex: 1;
    padding: 20px;
    width: 100%;
    position: relative;
    background: #fff;
    overflow: auto;
  }

  /* Fixed height for the weekly component */
  .weekly-spend-container {
    height: 350px; 
    justify-content: center;
    align-items: center;
  }

  .category-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    min-width: 250px;
  }
  
  .category-container:hover{
    transform: translateY(-5px);
  }

  .box-container:hover{
    transform: translateY(-5px);
  }

  .weekly-spend-container:hover{
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    .category-container {
      height: auto;
      margin-top: 20px;
    }

    .weekly-spend-container {
      height: 250px;
    }

    .dashboard-container {
      overflow: auto; 
    }
  }
</style>
<template>
    <div class="chart-container">
        <Line v-if="loaded" :data="chartData" class="weekend-chart"/>
    </div>
</template>

<script setup>
    import { Line } from "vue-chartjs";
    import { ref, onMounted } from "vue";
    import axios from 'axios';

    import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js";

    ChartJS.register( Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale);

    const chartData = ref({
        labels: [],
        datasets: []
    });

    const loaded = ref(false);


    onMounted(async () => {
        loaded.value = false

        try {
            const userInfo = JSON.parse(localStorage.getItem('user'))
            const userId = userInfo.id

            const transactions = await axios.get('http://localhost:3000/transactions')

            // 사용자 필터링
            transactions.data = transactions.data.filter(transaction => transaction.userId === userId);

            const currentDate = new Date();
            const fiveWeeksAgo = new Date();
            // 5주 전 날짜 설정
            fiveWeeksAgo.setDate(currentDate.getDate() - 35); 

            // 5주 전부터 현재까지의 트랜잭션 필터링
            const fiveWeekTransactions = transactions.data.filter(transaction => {
                const transactionDate = new Date(transaction.start);
                return transactionDate >= fiveWeeksAgo && transactionDate <= currentDate;
            });

            const weeklyTotals = Array.from({ length: 5 }, () => ({ income: 0, expense: 0 }));

            fiveWeekTransactions.forEach(transaction => {
                const transactionDate = new Date(transaction.start);
                const weekIndex = Math.floor((currentDate - transactionDate) / (7 * 24 * 60 * 60 * 1000));
                if (weekIndex < 5) {
                    if (transaction.type === 'income') {
                        weeklyTotals[weekIndex].income += parseInt(transaction.amount);
                    } else if (transaction.type === 'expense') {
                        weeklyTotals[weekIndex].expense += parseInt(transaction.amount);
                    }
                }
            });

            chartData.value = {
                labels: ["5주 전", "4주 전", "3주 전", "2주 전", "1주 전"],
                datasets: [
                    {
                        label: "Income",
                        data: weeklyTotals.map(week => week.income),
                        borderColor: "rgb(75, 192, 192)",
                        fill: false
                    },
                    {
                        label: "Expense",
                        data: weeklyTotals.map(week => week.expense),
                        borderColor: "rgb(255, 99, 132)",
                        fill: false
                    }
                ]
            };

            loaded.value = true;

        } catch (e) {
            console.error(e)
        }
    })

</script>

<style scoped>
    .chart-container {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .weekend-chart {
        width: 90%;
    }
</style>

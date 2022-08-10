export function expensesSumFunc(obj) {
  const total_sum = obj.reduce((sum, expense) => {
    return sum + expense.amount;
  }, 0);

  return total_sum;
}

// const expensesFoodSum = expensesFood.reduce((sum, expense) => {
//   return sum + expense.amount;
// }, 0);

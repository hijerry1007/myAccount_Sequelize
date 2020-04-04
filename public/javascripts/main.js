//折線圖 需要規定金額

// 圓餅圖
//資料標題



function changeData() {
  var labels = ['家居物業', '餐飲食品', '運輸交通', '休閒娛樂', '其他'];

  var ctx = document.getElementById('canvasPie').getContext('2d');
  var pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        //預設資料
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
          //資料顏色
          "#00A1FF",
          "#FF0004",
          "#F9F900",
          "#6C3365",
          "#272727"
        ],
      }],
    }
  });
  const homeAmount = Number(document.getElementById('homeAmount').textContent)
  const foodAmount = Number(document.getElementById('foodAmount').textContent)
  const transportAmount = Number(document.getElementById('transportAmount').textContent)
  const entertainmentAmount = Number(document.getElementById('entertainmentAmount').textContent)
  const otherAmount = Number(document.getElementById('otherAmount').textContent)


  pieChart.data.datasets[0].data = [homeAmount, foodAmount, transportAmount, entertainmentAmount, otherAmount];
  //更新
  pieChart.update();
}

changeData()











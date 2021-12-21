
// 현재시간 가져오는 함수
const getToday = () =>{
  let today = new Date();
  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1;  // 월
  let date = today.getDate();  // 날짜
  return `${year}-${month}-${date}`;
}

// json 데이터 HTML 뿌리기
const setJsonDataToHtml = jsonData => {
  let prevDate = -1; // 비교데이터(이전날짜)

  for (let data of jsonData){
    const currentTime = new Date(getToday()).getTime();
    const accountTime = new Date(data.date).getTime();
    const diff = currentTime - accountTime;
    const diffDay = diff / (1000*60*60*24);

    // HTML append
    let dateName = ""; // 날짜(몇일전)
    // 오늘 기준 몇일전인지 구하기
    if(diffDay === 0){
      dateName = "오늘";
    }else if(diffDay === 1){
      dateName = "어제";
    }else{
      dateName = `${diffDay}일전`;
    }

    const bankCloneWrapEl = document.querySelector(".bank__cloneWrap:last-child");
    const bankCloneGoodsEl = document.querySelector(".bank__cloneGoods:last-child");
    const bankPayListEl = document.querySelector(".bank__payList");

    // 날짜끼리 분류하기
    if(diffDay === prevDate){
      // 같은 날짜일 경우
      const sameCloneEl = bankCloneGoodsEl.cloneNode(true);
      sameCloneEl.querySelector(".goodsName").textContent = data.history;
      sameCloneEl.querySelector(".goodsPrice").textContent = Number(data.price).toLocaleString();
      bankCloneWrapEl.append(sameCloneEl);
    }else{
      // 다른 날짜일 경우
      if(prevDate===-1){
        // 최초 로직 실행시
        document.querySelector(".bank__date").textContent = dateName;
        document.querySelector(".goodsName").textContent = data.history;
        document.querySelector(".goodsPrice").textContent = Number(data.price).toLocaleString();
        prevDate = diffDay;
        continue;
      }
      const diffCloneEl = bankCloneWrapEl.cloneNode(true);
      const removeChild = diffCloneEl.querySelectorAll(".bank__cloneGoods");
      // 복제된 노드 삭제(첫번째 자식 제외)
      for(let i=1; i<removeChild.length; i++){
        removeChild[i].remove();
      }
      // 첫번째 자식 값 지정
      removeChild[0].querySelector(".goodsName").textContent = data.history;
      removeChild[0].querySelector(".goodsPrice").textContent = Number(data.price).toLocaleString();
      // 날짜 지정
      diffCloneEl.querySelector(".bank__date").textContent = dateName;

      bankPayListEl.append(diffCloneEl);
    }
    prevDate = diffDay;
  }
}

// 지출 계산
const payMoney = data => {
  const cloneWrapEl = document.querySelectorAll(".bank__cloneWrap");
  for(let cloneWrap of cloneWrapEl){
    const goodsPriceEl = cloneWrap.querySelectorAll(".goodsPrice");
    for(let goodsPrice of goodsPriceEl){
      //TODO : 전체 지출 계산하기!
    }
  }
}

// json 데이터 가져오기
const getData = async () => {
  const res = await fetch("https://jeondoh.github.io/FC_Lecture/ToyProject01/files/A1jo.json" );
  const data = await res.json();
  // 현재 일자 기준 filter
  let result = data.bankList.filter(a =>
      new Date(getToday()).getTime() >= new Date(a.date).getTime()
  );
  // 최신 날짜순으로 정렬
  result.sort((a, b) =>
      new Date(b.date) - new Date(a.date)
  );
  setJsonDataToHtml(result); // html append
  payMoney(result); // 지출 계산
}

document.addEventListener("DOMContentLoaded", () => { getData() });

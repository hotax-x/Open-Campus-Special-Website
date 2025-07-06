// ヘッダーの高さに合わせて上部の余白を調整
function adjustMainPadding() {
  // HTMLからclassが"main-header"の要素を探して、変数に保存
  const header = document.querySelector('.main-header');
  // HTMLからclassが"main"の要素を探して、変数に保存
  const main = document.querySelector('main');
  // headerとmainの両方がページにある時
  if (header && main) {
    // main要素のCSSをヘッダーの高さと同じ値に設定
    main.style.paddingTop = header.offsetHeight + 'px';
  }
}
// ページの初回読み込み時と、ウィンドウサイズ変更時にadjustMainPadding関数を実行
window.addEventListener('load', adjustMainPadding);
window.addEventListener('resize', adjustMainPadding);


// HTML構造が全て読み込まれたら
document.addEventListener("DOMContentLoaded", () => {

  // ハンバーガーメニュー機能
  // idが"hamburger"の要素を探して、変数に保存
  const hamburger = document.getElementById('hamburger');
  // idが"mainNav"の要素を探して、変数に保存
  const nav = document.getElementById('mainNav');
  // hambergerとmainNavが両方ページにある時
  if (hamburger && nav) {
    // ハンバーガーメニューがクリックされたとき
    hamburger.addEventListener('click', () => {
      // navにshowクラスがなければ追加, あれば削除 リストの表示非表示用
      nav.classList.toggle('show');
      // hamburgerにactiveクラスがなければ追加, あれば削除 アニメーションの管理用
      hamburger.classList.toggle('active');
    });
  }


  // 学部カードクリック時に学科表示
  // idから要素を探して変数に格納
  const facultyCard = document.getElementById("faculty-ci");
  // facultyCardが存在する場合のみ処理を実行
  if (facultyCard) {
    // idから学科カードのセクションを取得
    const departmentSection = document.getElementById("departments-ci");
    // classから全学部のカードを取得
    const allFacultyCards = document.querySelectorAll(".faculty-card-wrapper");
    // 学科が表示されているかどうか
    let isDepartmentVisible = false;
    // アニメーション実行中かどうか
    let isTransitioning = false;

    // 学部カードがクリックされたとき
    facultyCard.addEventListener("click", (e) => {

      // アニメーション中やフッター部の場合は処理を中断
      if (e.target.closest('.faculty-card-footer') || isTransitioning) return;

      // アニメーション開始
      isTransitioning = true;

      //もし学科カードが非表示なら
      if (!isDepartmentVisible) {
        // 全ての学部カードを一つずつチェック
        allFacultyCards.forEach((cardWrapper) => {
          // 今クリックされたカードでなければ
          if (!cardWrapper.contains(facultyCard)) {
            // そのカードに"fade-out"を追加してCSSアニメーションを開始
            cardWrapper.classList.add("fade-out");
            // 0.5秒後にカードを非表示にする
            setTimeout(() => {
              cardWrapper.style.display = "none";
            }, 500);
          }
        });

        // 学科セクションに"show"クラスを追加 アニメーションを開始
        departmentSection.classList.add("show");
        // "学科は表示中"という状態にフラグを更新
        isDepartmentVisible = true;
      } else {
        // 表示されているカードを再度クリックした場合
        // 学科セクションから"show"クラスを削除して非表示
        departmentSection.classList.remove("show");

        allFacultyCards.forEach((cardWrapper) => {
          if (!cardWrapper.contains(facultyCard)) {
            cardWrapper.style.display = "";
            cardWrapper.classList.remove("fade-out");
            cardWrapper.classList.add("fade-in");
            setTimeout(() => {
              cardWrapper.classList.remove("fade-in");
            }, 500);
          }
        });
        // "学科は非表示"という状態にフラグを更新
        isDepartmentVisible = false;
      }
      setTimeout(() => { isTransitioning = false; }, 600);
    });
  }


  // スクロール時にフェードアップするアニメーション
  const faders = document.querySelectorAll('.fade-up');
  if (faders.length > 0) {
    // 要素が画面に入っているか、出ているかを監視
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // 要素が画面内にあれば、"in_view"クラスを追加し、CSSでアニメーション
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 }); // 10%画面に入ったら

    faders.forEach(el => {
      observer.observe(el);
    });
  }


  // ページ内のスムーズスクロール
  // ヘッダーの高さを考慮して、適切な位置へスクロール
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === "#" || targetId === "") return;

      const target = document.querySelector(targetId);
      if (target) {
        // デフォルトの瞬間移動をキャンセル
        e.preventDefault();
        // ヘッダーの高さと画面上部からの位置から、スクロール位置を計算
        const headerOffset = document.querySelector('.main-header').offsetHeight;
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        // 計算した位置にスクロールする
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth' // スムーズにスクロール
        });
      }
    });
  });


  // 予約ページからの情報を受け取り、予約確認カードを表示する
  // sessionStorageから予約情報データを取得
  const reservationJSON = sessionStorage.getItem('labReservation');
  // データがあったとき各要素を取得
  if (reservationJSON) {
    const reservationData = JSON.parse(reservationJSON);
    const listContainer = document.getElementById('reservation-list');
    const noReservationMsg = document.getElementById('no-reservation-message');

    if (listContainer && noReservationMsg) {
      //「予約なし」メッセージに"hidden"クラスを追加し非表示に
      noReservationMsg.classList.add('hidden');
      // 表示する予約カードのHTMLコードを文字列として生成する
      const cardHTML = `
                <div class="reservation-info-card">
                    <img src="assets/img/labs1.jpeg" alt="${reservationData.labName}の画像" class="card-image">
                    <div class="card-details">
                        <h3 class="card-lab-name">${reservationData.labName}</h3>
                        <p class="card-datetime">${reservationData.date} ${reservationData.time}～</p>
                        <a href="creative_ai.html" class="card-button">予約ページ</a>
                    </div>
                </div>
            `;
      // 生成したHTMLをページに挿入
      listContainer.innerHTML = cardHTML;
      // 一度表示したら、sessionStorageから情報を削除 (本来は消さない方がいいが、次回以降この動作が見えなくなるため削除)
      sessionStorage.removeItem('labReservation');
    }
  }

});
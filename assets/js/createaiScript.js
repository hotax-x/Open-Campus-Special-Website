// HTML構造が全て読み込まれたら
document.addEventListener('DOMContentLoaded', () => {
    // 操作対象の要素を取得
    const dateRadios = document.querySelectorAll('input[name="date"]');
    const timeSelectorContainer = document.querySelector('.time-selector');
    const timetableContainer = document.getElementById('timetable-container');
    const timetableSaturday = document.getElementById('timetable-saturday');
    const timetableSunday = document.getElementById('timetable-sunday');
    const modal = document.getElementById('reservation-modal');
    const modalText = document.getElementById('modal-text');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');

    let selectedDate = '';
    let selectedTime = '';
    let activeTimetable = null;
    // アニメーション中に操作を無効にするためのフラグ
    let isAnimating = false;

    // 表示中のタイムテーブルに合わせてコンテナの高さを調整
    function adjustContainerHeight() {
        if (activeTimetable) {
            // 表示中テーブルの実際のコンテンツの高さを取得して適用
            timetableContainer.style.height = activeTimetable.scrollHeight + 'px';
        } else {
            // 表示中のテーブルがなければ高さを0にする
            timetableContainer.style.height = '0px';
        }
    }

    // 日付選択のイベントリスナー
    dateRadios.forEach(radio => {
        // ラジオボタンの選択が変更されたとき実行
        radio.addEventListener('change', (e) => {
            // アニメーション中なら処理を中断
            if (isAnimating) return;

            // 選択されたラジオボタンの文字を取得
            selectedDate = e.target.nextElementSibling.textContent;
            // 取得した文字が'7.26'つまり土曜日なら土曜の時間枠テーブル、そうでなければ日曜の時間枠テーブル
            const targetTimetable = (e.target.value === '7.26') ? timetableSaturday : timetableSunday;

            // 同じ日付をクリックしたときは処理を中断
            if (targetTimetable === activeTimetable) return;

            // hiddenクラスを削除し、時間枠を表示する
            timeSelectorContainer.classList.remove('hidden');
            isAnimating = true;
            // この時時間枠テーブルが既に表示されていたらactiveクラスを削除し非表示にする
            if (activeTimetable) {
                activeTimetable.classList.remove('active');
            }
            // 新しいテーブルを表示する前に一度全て非表示にすることでアニメーションをわかりやすくする
            timetableContainer.style.height = '0px';

            // 指定時間後に処理を実行
            setTimeout(() => {
                setTimeout(() => {
                    targetTimetable.classList.add('active');
                    activeTimetable = targetTimetable;
                    // 新しいテーブルを表示した直後に高さを調整
                    adjustContainerHeight();
                    isAnimating = false;
                }, 150);
            }, activeTimetable ? 400 : 0);
        });
    });

    // ウィンドウサイズ変更時にも高さを再調整する
    window.addEventListener('resize', adjustContainerHeight);

    // 時間枠クリック時の処理
    timetableContainer.addEventListener('click', (e) => {
        // 時間枠のどの部分をクリックしても反応するように
        const clickedSlot = e.target.closest('.time-slot.available');
        // 予約可能な時間枠がクリックされたときのみ処理を実行
        if (clickedSlot) {
            // 時間を取得
            selectedTime = clickedSlot.dataset.time;
            // モーダルウィンドウのテキストを更新し、showクラスを付与することで表示
            modalText.textContent = `${selectedDate} の ${selectedTime}〜 の回で予約を確定しますか？`;
            modal.classList.add('show');
        }
    });

    // モーダルウィンドウの操作関係
    const closeModal = () => modal.classList.remove('show');
    // 予約を確定ボタンを押したとき
    modalConfirmBtn.addEventListener('click', () => {
        // 今回は7月27日の12:00からの回を予約したときの処理のみ実装
        if (selectedDate.includes('7月27日') && selectedTime === '12:00') {
            const reservationData = {
                labName: 'クリエイティブAI研究室',
                date: '7月27日 (日)',
                time: '12:00'
            };
            // 予約情報をsessionStorageに保存して、メインページの予約確認セクションへ
            sessionStorage.setItem('labReservation', JSON.stringify(reservationData));
            window.location.href = 'main.html#reservation';
        } else {
            alert(`${selectedDate} ${selectedTime}〜 で予約が完了しました！`);
            closeModal();
        }
    });
    // キャンセルボタンを押したとき
    modalCancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        // モーダルウィンドウの外側をクリックしたときも、モーダルウィンドウが閉じるように設定
        if (e.target === modal) {
            closeModal();
        }
    });
});
// ヘッダーに隠れないようにするための処理
function adjustMainMargin() {
    const header = document.querySelector('.dept-header');  // ヘッダーの高さをピクセル単位で取得
    const main = document.querySelector('main');
    if (header && main) {
        const headerHeight = header.offsetHeight;
        main.style.marginTop = headerHeight + 'px'; // main要素のmarginTopをヘッダーと同じ高さにする
        document.documentElement.style.scrollPaddingTop = headerHeight + 'px';  // ヘッダーの高さ分の余白を設定し、スクロール先がヘッダーに隠れるのを防ぐ
    }
}
window.addEventListener('DOMContentLoaded', adjustMainMargin);  // 読み込み完了時
window.addEventListener('resize', adjustMainMargin);    // ウィンドウサイズ変更時

document.addEventListener('DOMContentLoaded', () => {

    // ハンバーガーメニューの開閉処理
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const header = document.querySelector('.dept-header');

    // 3つの要素全てがページ内に存在するときだけ実行
    if (hamburger && mobileNav && header) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');   //アニメーション
            mobileNav.classList.toggle('show'); //表示切替
            const headerHeight = header.offsetHeight;
            mobileNav.style.top = headerHeight + 'px';  //ヘッダーの高さを取得し、ナビゲーション位置をヘッダーの下に
        });

        mobileNav.querySelectorAll('a').forEach(link => {   //全てのaタグを取得し処理する
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('show');
            });
        });
    }

    // タグ絞り込み機能
    const tagRadioButtons = document.querySelectorAll('input[name="tag"]'); // ラジオボタン全て
    const labCards = document.querySelectorAll('.labs-section .col-md-6.col-lg-4'); // 研究室のカードの親要素
    let isAnimating = false;
    const animationDuration = 400;  // 連続クリックによるアニメーション崩れを予防

    const filterLabs = () => {
        if (isAnimating) return;
        isAnimating = true;

        const selectedTag = document.querySelector('input[name="tag"]:checked').value;  // 現在チェックされているラジオボタンの文字を取得
        const cardsToShow = [];

        labCards.forEach(card => {
            if (window.getComputedStyle(card).display !== 'none') {
                card.style.opacity = '0';
            }
        });

        setTimeout(() => {
            labCards.forEach(card => {
                card.style.display = 'none';
            });

            labCards.forEach(card => {
                let isTagFound = false;
                if (selectedTag === 'all') {
                    isTagFound = true;
                } else {
                    const tagsInCard = card.querySelectorAll('.lab-tag');
                    tagsInCard.forEach(tagElement => {
                        if (tagElement.textContent.trim().substring(1) === selectedTag) {
                            isTagFound = true;
                        }
                    });
                }
                if (isTagFound) {
                    card.style.display = 'block';
                    cardsToShow.push(card); // 選択されたタグを持ったカードのみを表示対象に
                }
            });

            requestAnimationFrame(() => {
                cardsToShow.forEach(card => {
                    card.style.opacity = '1';
                });
            });

            setTimeout(() => {
                isAnimating = false;
            }, animationDuration);

        }, animationDuration);
    };

    tagRadioButtons.forEach(radio => {
        radio.addEventListener('change', filterLabs);
    });

    labCards.forEach(card => {
        card.style.opacity = '1';
    });


    // スクロールによるフェードインアニメーション
    const targets = document.querySelectorAll(
        '.department-image, .section-title, .section-text, .info-card, .tag-filter-wrapper, .lab-card'
    );

    const observer = new IntersectionObserver((entries, observer) => {  // 要素が画面に入っているか、出ているかを監視
        entries.forEach(entry => {
            if (entry.isIntersecting) { // 要素が画面内に入ったとき
                entry.target.classList.add('visible');  // CSSで設定したアニメーションが開始
                observer.unobserve(entry.target);   // 一度アニメーションした要素の監視を停止
            }
        });
    }, {
        threshold: 0.1  // 10%画面に入ったら
    });

    targets.forEach(target => {
        target.classList.add('fade-in-target');
        observer.observe(target);
    });
});
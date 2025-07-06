const registerTab = document.getElementById("registerTab");
const loginTab = document.getElementById("loginTab");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

//新規登録タブをクリックしたときの処理
registerTab.onclick = () => {
    registerTab.classList.add("active");  //新規登録タブをアクティブ
    loginTab.classList.remove("active");  //ログインタブのアクティブ解除
    registerForm.classList.remove("d-none");  //新規登録フォームの表示
    loginForm.classList.add("d-none");    //ログインフォームを非表示
};

//ログインタブをクリックしたときの処理 (新規登録タブと逆の処理)
loginTab.onclick = () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.remove("d-none");
    registerForm.classList.add("d-none");
};

//<form>要素を取得、ログインボタンが押されたか判定
const loginFormElement = document.getElementById("loginFormElement");
loginFormElement.addEventListener("submit", function (event) {
    event.preventDefault();

    //メールアドレスとパスワードの値を取得
    const email = loginFormElement.querySelector("input[type='email']").value;
    const password = loginFormElement.querySelector("input[type='password']").value;

    //新規登録で登録したメールアドレス・パスワードと照合
    if (email === "aaa@bbb.com" && password === "aaabbbccc") {
        window.location.href = "main.html"; //一致していた場合、メインページへ移動
    } else {
        alert("メールアドレスまたはパスワードが正しくありません。");
    }
});

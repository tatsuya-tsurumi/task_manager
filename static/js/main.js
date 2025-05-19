// 要素全体を1秒かけてフェードイン
$(window).on("load", function() {
    $('.border1').fadeIn(1000); 
});

// ID・ステータス情報取得。updateStatus()呼び出し
document.querySelectorAll(".status-select").forEach(select => {
  select.addEventListener("change", function () {
    const id = this.dataset.id;
    const status = this.value;
    updateStatus(id, status)
  })
});

// IDからステータス情報更新リクエスト
function updateStatus(id, newStatus) {
  fetch(`/todo_status/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: newStatus })
  })
  .then(response => {
    if (response.ok) {
      if (newStatus === '完了') {
        const row = document.getElementById(`todo-${id}`);
        if (row) row.remove();  // 表示から削除
      }
    } else {
      console.error('ステータス更新失敗');
    }
  })
  // エラー対応
  .catch(error => {
    console.error('通信エラー:', error);
  });
}

// 変数設定
const path = anime.path('#motionPath');
let flipped = false;

// トップページのキャラの動き
const swing = {
  targets: ".chara01 img", // 左右に揺らす動きを新規作成したimgタグに設定する
  easing: "linear", // イージングは一定（linear）に設定
  rotate: [0, -15], // 左右に10度ずつ揺らす
  duration: 1000, // 歩く速度の1/10くらいに設定
  loop: true, // 揺れを繰り返す
};

// 登録ページのキャラの動き
const swing2 = {
  targets: ".chara02", // 対象のimgタグを設定
  easing: "linear", // 一定スピード（linear）に設定
  duration: 10000, // 10秒かけて実施
  scale: [0.5, 1, 1,5, 2], // 大きさを調整
  rotate: [10, -10], // 左右に10度ずつ揺らす
  direction: "alternate", // 揺れる方向を設定。「行って戻る」ように揺らす
  loop: true, // 揺れを繰り返す
};

// 編集ページのキャラの動き
function startWalk() {
  anime({
    targets: ".chara03", // 対象のimgタグを設定
    translateX: 1500, // X方向に1500pxに移動
    scaleX: 1, // 元の方向へ戻す
    easing: "easeInQuad", // だんだん早く移動
    duration: 4000, // 4秒かけて実施
    delay: 2000, //2秒遅れて動き出す
    complete: function() {
      flipped = true;
      anime({
        targets: ".chara03", // 対象のimgタグを設定
        scaleX: -1, // 反転
        duration: 3000, //3秒かけて実施
        complete: function() {
          anime({
            targets: ".chara03", // 対象のimgタグを設定
            translateX: 0, //元の場所へ戻す
            easing: "easeOutQuad", // だんだん遅く移動
            duration: 3000, // 3秒かけて実施
            complete: function() {
              flipped = false;
              anime({
                targets: ".chara03", // 対象のimgタグを設定
                scaleX: 1, // 元の方向へ戻す
                duration: 0, // すぐ実施
                complete: startWalk // 再帰でループ
              });
            }
          });
        }
      });
    }
  });
}

// トップページのキャラの動き
function startWalk2() {
  anime({
    targets: ".chara01", // 対象のimgタグを設定
    translateX: -1010, // X方向に-1010pxに移動
    scaleX: 1, // 元の方向へ戻す
    easing: "linear", // 一定スピード（linear）に設定
    duration: 4000, // 4秒かけて実施
    delay: 2000, //2秒遅れて動き出す
    complete: function() {
      flipped = true;
      anime({
        targets: ".chara01", // 対象のimgタグを設定
        scaleX: -1, // 反転
        duration: 0, // 一瞬で
        complete: function() {
          anime({
            targets: ".chara01", // 対象のimgタグを設定
            translateX: 0, //元の場所へ戻す
            easing: "linear", // 一定スピード（linear）に設定
            duration: 4000, // 4秒かけて実施
            delay: 1000, //1秒遅れて動き出す
            complete: function() {
              flipped = false;
              anime({
                targets: ".chara01", // 対象のimgタグを設定
                scaleX: 1, // 元の方向へ戻す
                duration: 0, // 一瞬で
                complete: startWalk2 // 再帰でループ
              });
            }
          });
        }
      });
    }
  });
}


// それぞれの処理を呼び出す
startWalk();
startWalk2();
anime(swing)
anime(swing2)

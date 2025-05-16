$(window).on("load", function() {
    $('.border1').fadeIn(1000); 
});

document.querySelectorAll(".status-select").forEach(select => {
  select.addEventListener("change", function () {
    const id = this.dataset.id;
    const status = this.value;
    updateStatus(id, status)
  })
});

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
  .catch(error => {
    console.error('通信エラー:', error);
  });
}

const path = anime.path('#motionPath');
let flipped = false;

const swing = {
  targets: ".chara01 img", // 左右に揺らす動きを新規作成したimgタグに設定する
  easing: "linear", // イージングは一定（linear）に設定
  rotate: [0, -15], // 左右に10度ずつ揺らす
  duration: 1000, // 歩く速度の1/10くらいに設定
  loop: true, // 揺れを繰り返す
};

const swing2 = {
  targets: ".chara02 img", // 左右に揺らす動きを新規作成したimgタグに設定する
  easing: "linear", // イージングは一定（linear）に設定
  delay: 300,
  duration: 10000,
  scale: [0.5, 1, 1,5, 2, 3],
  rotate: [10, -10], // 左右に10度ずつ揺らす
  direction: "alternate", // 揺れる方向を設定。「行って戻る」ように揺らがせる
  loop: true, // 揺れを繰り返す
};

function startWalk() {
  anime({
    targets: ".chara03",
    translateX: 1500,
    scaleX: 1,
    easing: "easeInQuad",
    duration: 4000,
    delay: 2000,
    complete: function() {
      flipped = true;
      anime({
        targets: ".chara03",
        scaleX: -1, // 反転してから
        duration: 3000, 
        complete: function() {
          anime({
            targets: ".chara03",
            translateX: 0,
            easing: "easeOutQuad",
            duration: 3000,
            complete: function() {
              flipped = false;
              anime({
                targets: ".chara03",
                scaleX: 1,
                duration: 0,
                complete: startWalk // 再帰でループ
              });
            }
          });
        }
      });
    }
  });
}
function startWalk2() {
  anime({
    targets: ".chara01",
    translateX: -1010,
    scaleX: 1,
    easing: "linear",
    duration: 4000,
    delay: 2000,
    complete: function() {
      flipped = true;
      anime({
        targets: ".chara01",
        scaleX: -1, // 反転してから
        duration: 0, // 一瞬で
        complete: function() {
          anime({
            targets: ".chara01",
            translateX: 0,
            easing: "linear",
            duration: 4000,
            delay: 1000,
            complete: function() {
              flipped = false;
              anime({
                targets: ".chara01",
                scaleX: 1,
                duration: 0,
                complete: startWalk2 // 再帰でループ
              });
            }
          });
        }
      });
    }
  });
}


// anime(walk)
startWalk();
startWalk2();
anime(swing)
anime(swing2)

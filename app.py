from flask import Flask
from flask import render_template,g,redirect,request,flash,url_for
import sqlite3
DATABASE = "flasktodo.db"

app = Flask(__name__)
app.secret_key = 'dev_secret_key'

# 初期画面、タスク一覧を表示(進行中のみ)
@app.route("/")
def main():
  todo_list = get_db().execute("SELECT id,title,detail,deadline,status FROM todo WHERE status = '進行中' ORDER BY deadline ASC").fetchall()
  return render_template("index.html",todo_list = todo_list)

# タスク一覧を表示(全案件)
@app.route("/todo_all")
def all():
  todo_list = get_db().execute("SELECT id,title,detail,deadline,status FROM todo ORDER BY deadline ASC").fetchall()
  check = any(todo['status'] == '完了' for todo in todo_list)
  return render_template("index.html",todo_list = todo_list,check=check)

# 登録画面。GET:タスク登録ページへ遷移、POST:DBへ案件登録実施
@app.route("/todo_regist", methods=['GET', 'POST'])
def regist():
  if request.method == "POST":
    # 画面からの登録情報の取得
    title = request.form.get('title')
    detail = request.form.get('detail')
    deadline = request.form.get('deadline')
    status = request.form.get('status')
    if title == "":
      flash("件名は必須です")
      return render_template("/todo_regist.html",title=title,detail=detail,deadline=deadline,status=status)
    if status == "":
      flash("状況が選択されていません")
      return render_template("/todo_regist.html",title=title,detail=detail,deadline=deadline,status=status)
    db = get_db()
    db.execute("INSERT INTO todo (title,detail,deadline,status) VALUES (?,?,?,?)", [title,detail,deadline,status])
    db.commit()
    return redirect("/")
  return render_template("todo_regist.html")

# 編集画面。GET:タスク編集ページへ遷移、POST:DBへ登録情報更新
@app.route("/<id>/todo_edit", methods=["GET", "POST"])
def edit(id):
  if request.method == "POST":
    #画面からの登録情報の取得
    title = request.form.get("title")
    detail = request.form.get("detail")
    deadline = request.form.get("deadline")
    status = request.form.get("status")
    if title == "":
      flash("件名は必須です")
      return render_template("/todo_edit.html",title=title,detail=detail,deadline=deadline,status=status)
    if status == "":
      flash("状況が選択されていません")
      return render_template("/todo_edit.html",title=title,detail=detail,deadline=deadline,status=status)
    db = get_db()
    db.execute("UPDATE todo SET title=?, detail=?, deadline=?, status=? WHERE id =?",[title,detail,deadline,status,id])
    db.commit()
    return redirect("/")
  post = get_db().execute("SELECT id,title,detail,deadline,status FROM todo WHERE id=?",(id,)).fetchone()
  return render_template("todo_edit.html",post=post)

# 一覧ページからのリクエスト。POST:ステータス情報を更新
@app.route("/todo_status/<id>", methods=["POST"])
def update_status(id):
  status = request.json.get("status")
  db = get_db()
  db.execute("UPDATE todo SET status = ? WHERE id = ?", (status, id))
  db.commit()
  return "", 204

# 一覧ページからのリクエスト。GET:タスク削除
@app.route("/<id>/todo_delete", methods=["GET"])
def delete(id):
    db = get_db()
    db.execute("DELETE FROM todo WHERE id =?",(id))
    db.commit()
    return redirect("/")

# 404エラー発生時のルーティング
@app.errorhandler(404)
def not_found_err(error):
  return render_template('404.html'),404

# 500エラー発生時のルーティング
@app.errorhandler(500)
def not_found_err(error):
  return render_template('500.html'),500

if __name__ == "__main__":
  app.run()

# DATABASE接続処理
def connect_db():
  rv = sqlite3.connect(DATABASE)
  rv.row_factory = sqlite3.Row
  return rv
def get_db():
  if not hasattr(g,'sqlite.db'):
    g.sqlite_db = connect_db()
  return g.sqlite_db

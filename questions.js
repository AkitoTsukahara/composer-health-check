const sections = [
  {
    badge: "① 取り込む前",
    desc: "S2C2F: Ingest",
    extra: false,
    questions: [
      {
        code: "01",
        main: true,
        text: "公開直後のパッケージをすぐに取り込まないようにしていますか？",
        hint: "Dependabot / Renovate のクールダウン設定など（Composer本体のminimum-release-ageは未実装）",
        advice: "攻撃者の悪性リリースは数分〜数時間で検知・削除されることが多く、公開直後の数日を見送るだけで大半を回避できます。Dependabot / Renovate のクールダウン設定を有効にしてください。"
      },
      {
        code: "02",
        main: false,
        text: "新しい依存を追加する前に、パッケージの素性を確認していますか？",
        hint: "メンテナ・活動状況・本当に必要か（1関数のために入れていないか）",
        advice: "依存を1つ増やすことは信頼関係を1つ増やすこと。追加前に「そもそも必要か」「代替はないか」を検討するだけで攻撃対象面を減らせます。"
      },
      {
        code: "03",
        main: false,
        text: "（組織向け）パッケージの取り込み窓口を一元化していますか？",
        hint: "Private Packagist等のミラー経由。個人開発など該当しない場合は「はい」を選択",
        advice: "ミラーを経由すると、マルウェア版のダウンロードを組織全体でブロックできます（古いComposerクライアントにも有効）。組織での導入を検討してください。"
      }
    ]
  },
  {
    badge: "土台",
    desc: "すべての防御機能の前提",
    extra: false,
    questions: [
      {
        code: "04",
        main: true,
        text: "Composerのバージョンは最新ですか？",
        hint: "composer self-update ですぐに更新できます",
        advice: "Composer自体にRCE脆弱性（CVE-2026-40176等）が見つかっています。また2.10のマルウェア検知やタグ改ざん防止は、最新版でないと使えません。<code>composer self-update</code> を実行してください。"
      }
    ]
  },
  {
    badge: "② 取り込む時",
    desc: "S2C2F: Scan / Enforce",
    extra: false,
    questions: [
      {
        code: "05",
        main: true,
        text: "composer.lock をリポジトリにコミットしていますか？",
        hint: "依存関係の再現性と改ざん検知のため",
        advice: "lockファイルにはコミット参照とハッシュが記録され、「バージョン番号が同じまま中身が変わる」攻撃（laravel-lang事件の手口）への検知の手がかりになります。"
      },
      {
        code: "06",
        main: true,
        text: "allow-plugins を許可リスト化していますか？",
        hint: "composer.json での明示的な列挙",
        advice: "普通のライブラリが突然Composerプラグイン化して任意コードを実行する手口（intercom-php事件）を防げます。プラグインとして動いてよいパッケージを <code>allow-plugins</code> に明示的に列挙してください。"
      },
      {
        code: "07",
        main: true,
        text: "CIの composer install に --no-scripts --no-plugins を付けていますか？",
        hint: "インストール時フックの自動実行を防止",
        advice: "悪意あるコードの実行きっかけの多くはインストール時のフックです。CIの <code>composer install</code> に <code>--no-scripts --no-plugins</code> を付けてください。"
      }
    ]
  },
  {
    badge: "③ 使っている間",
    desc: "S2C2F: Inventory / Audit / Update",
    extra: false,
    questions: [
      {
        code: "08",
        main: true,
        text: "CIで composer audit を必須ステップにしていますか？",
        hint: "composer audit --format=summary || exit 1",
        advice: "audit.block-insecure（2.9〜）はupdate/require時のみ有効で、composer installは素通りします。CIに <code>composer audit</code> を必須ステップとして追加してください。"
      },
      {
        code: "09",
        main: false,
        text: "プルリクで composer.lock の差分をレビューしていますか？",
        hint: "意図しない依存追加・バージョン変更への最後の目視ポイント",
        advice: "lockをコミットしていても、差分を見なければ改ざんに気づけません。「なぜこの間接依存が増えた？」に答えられる運用にしてください。"
      },
      {
        code: "10",
        main: false,
        text: "脆弱性発見から一定期間内に更新するルールがありますか？",
        hint: "期限の目安を決めておくことで対応が習慣化します",
        advice: "「気づいたら直す」ではなく期限の目安（例：72時間以内）を決めることで、検知から更新までの所要時間を縮められます。"
      },
      {
        code: "11",
        main: false,
        text: "上流の修正が遅い場合の代替手段（フォーク等）を把握していますか？",
        hint: "Composerのrepositories設定で自社フォークを優先可能",
        advice: "頻繁に使う手段ではありませんが、選択肢を知っていること自体がインシデント時の初動を早くします。"
      }
    ]
  },
  {
    badge: "番外編",
    desc: "Composerの外側（CI/CD全体）",
    extra: true,
    questions: [
      {
        code: "12",
        main: false,
        text: "CIに渡すクレデンシャル（AWS等）は必要最小限の権限にしていますか？",
        hint: "IAMロールの最小権限化",
        advice: "万一の侵害時に、盗まれたクレデンシャルでできることを最小化できます。CI/CDに渡すロールの権限を見直してください。"
      },
      {
        code: "13",
        main: false,
        text: "ComposerをCI/Docker上で非rootユーザーで実行していますか？",
        hint: "RCE時の被害範囲の限定",
        advice: "非rootユーザーでの実行により、万一のRCE時の被害範囲を限定できます。公式イメージはrootがデフォルトのケースが多いため、明示的な設定が必要です。"
      }
    ]
  }
];

const allQuestions = sections.flatMap(s => s.questions);
const TOTAL = allQuestions.length;
const answers = {};

/* ---- render ---- */
const qsections = document.getElementById('qsections');
let qIndex = 0;
sections.forEach(sec => {
  const head = document.createElement('div');
  head.className = 'section-head';
  head.innerHTML = `
    <span class="section-badge${sec.extra ? ' extra' : ''}">${sec.badge}</span>
    <span class="section-desc">${sec.desc}</span>
  `;
  qsections.appendChild(head);

  const list = document.createElement('div');
  list.className = 'qlist';
  sec.questions.forEach(q => {
    const i = qIndex++;
    q._index = i;
    const row = document.createElement('div');
    row.className = 'qrow';
    row.innerHTML = `
      <div class="qcode">${q.code}</div>
      <div class="qbody">
        <p class="qtext">${q.text}${q.main ? '<span class="star">★ 本編</span>' : ''}</p>
        <p class="qhint">${q.hint}</p>
      </div>
      <div class="qanswer" data-index="${i}">
        <button type="button" class="markbtn yes" aria-label="はい">○</button>
        <button type="button" class="markbtn no" aria-label="いいえ">✕</button>
      </div>
    `;
    list.appendChild(row);
  });
  qsections.appendChild(list);
});

qsections.addEventListener('click', (e) => {
  const btn = e.target.closest('.markbtn');
  if (!btn) return;
  const group = btn.closest('.qanswer');
  const idx = group.dataset.index;
  group.querySelectorAll('.markbtn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  answers[idx] = btn.classList.contains('yes');
  document.getElementById('progressChip').textContent =
    `回答済み ${Object.keys(answers).length} / ${TOTAL}`;
});

document.getElementById('pdate').value =
  new Date().toLocaleDateString('ja-JP', { year:'numeric', month:'2-digit', day:'2-digit' });

const submitBtn = document.getElementById('submitBtn');
document.getElementById('consentCheck').addEventListener('change', (e) => {
  submitBtn.disabled = !e.target.checked;
});

/* ---- grading ----
   本編項目（★）は重み2、補足項目は重み1。
   重み付き失点率と、本編項目の未達数の両方で判定する。 */
function grade(mainMiss, subMiss){
  const missScore = mainMiss * 2 + subMiss;      // max 12 + 7 = 19
  if (missScore === 0) return { letter:'A', kanji:'異常なし', color:'--grade-a',
    title:'異常なし',
    desc:'今回の問診では、気になる項目は見つかりませんでした。この状態を維持してください。' };
  if (mainMiss === 0 && missScore <= 3) return { letter:'B', kanji:'軽度異常', color:'--grade-b',
    title:'軽度の所見あり',
    desc:'重要項目はすべてクリアしています。補足項目をいくつか見直すと、さらに堅牢になります。' };
  if (mainMiss <= 1 && missScore <= 6) return { letter:'C', kanji:'要経過観察', color:'--grade-c',
    title:'要経過観察',
    desc:'いくつかの対策が手薄になっています。★印の本編項目から優先的に着手してください。' };
  if (mainMiss <= 3 && missScore <= 12) return { letter:'D', kanji:'要治療', color:'--grade-d',
    title:'要治療',
    desc:'サプライチェーン攻撃への耐性が低い状態です。処方箋の「要治療」項目から早めの対応をおすすめします。' };
  return { letter:'E', kanji:'要精密検査', color:'--grade-e',
    title:'要精密検査',
    desc:'基本的な対策の多くが未実施です。まずは処方箋の上から順に、1つずつ着手していきましょう。' };
}

document.getElementById('submitBtn').addEventListener('click', () => {
  const missMain = [];
  const missSub = [];
  allQuestions.forEach(q => {
    const ok = answers[q._index] === true;
    if (!ok) (q.main ? missMain : missSub).push(q);
  });

  const g = grade(missMain.length, missSub.length);

  document.getElementById('gradeLetter').textContent = g.letter;
  document.getElementById('gradeKanji').textContent = g.kanji;
  document.getElementById('resultTitle').textContent = `判定：${g.title}`;
  document.getElementById('resultDesc').textContent = g.desc;

  const stamp = document.getElementById('stamp');
  stamp.style.borderColor = `var(${g.color})`;
  stamp.style.color = `var(${g.color})`;
  stamp.classList.remove('animate');
  void stamp.offsetWidth;
  stamp.classList.add('animate');

  const findingsBlock = document.getElementById('findingsBlock');
  const allClearBlock = document.getElementById('allClearBlock');
  const findingsList = document.getElementById('findingsList');
  findingsList.innerHTML = '';

  if (missMain.length === 0 && missSub.length === 0){
    findingsBlock.style.display = 'none';
    allClearBlock.style.display = 'block';
  } else {
    findingsBlock.style.display = 'block';
    allClearBlock.style.display = 'none';

    if (missMain.length > 0){
      const label = document.createElement('div');
      label.className = 'finding-group-label';
      label.textContent = '要治療（本編の重要項目）';
      findingsList.appendChild(label);
      missMain.forEach(q => findingsList.appendChild(renderFinding(q, false)));
    }
    if (missSub.length > 0){
      const label = document.createElement('div');
      label.className = 'finding-group-label watch';
      label.textContent = '経過観察（補足項目）';
      findingsList.appendChild(label);
      missSub.forEach(q => findingsList.appendChild(renderFinding(q, true)));
    }
  }

  const result = document.getElementById('result');
  result.classList.add('show');
  result.scrollIntoView({ behavior:'smooth', block:'start' });
});

function renderFinding(q, watch){
  const item = document.createElement('div');
  item.className = 'finding-item' + (watch ? ' watch' : '');
  item.innerHTML = `
    <div class="finding-tag">${q.code}</div>
    <div class="finding-body">
      <b>${q.text}</b>
      <span>${q.advice}</span>
    </div>
  `;
  return item;
}

document.getElementById('retryBtn').addEventListener('click', () => {
  document.getElementById('result').classList.remove('show');
  document.querySelectorAll('.markbtn.selected').forEach(b => b.classList.remove('selected'));
  Object.keys(answers).forEach(k => delete answers[k]);
  document.getElementById('progressChip').textContent = `回答済み 0 / ${TOTAL}`;
  window.scrollTo({ top:0, behavior:'smooth' });
});

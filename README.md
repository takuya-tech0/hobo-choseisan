ほぼ調整さんアプリケーション構造解説
アプリケーション概要
「ほぼ調整さん」は会議スケジュール調整を効率化するアプリケーションです。Microsoft認証を利用してユーザーの予定表と連携し、参加者の空き状況を確認して会議依頼を送信できます。
フォルダ構造
コピーsrc/
└── app/
    ├── auth/
    │   └── config.ts       # Microsoft認証の設定ファイル
    ├── components/
    │   ├── ui/            # UI共通コンポーネント(shadcn/ui)
    │   ├── AppContent.tsx  # メインアプリのレイアウト
    │   ├── AuthProvider.tsx # 認証コンテキストプロバイダー
    │   ├── Calendar.tsx     # カレンダーコンポーネント
    │   ├── LoginScreen.tsx  # ログイン画面
    │   ├── MeetingDuration.tsx # 会議時間選択
    │   ├── MeetingInvite.tsx   # 会議依頼送信フォーム
    │   ├── ScheduleTable.tsx   # 日時ごとの空き状況表
    │   ├── SearchContent.tsx   # 検索機能と結果表示
    │   └── UserSearch.tsx      # ユーザー検索機能
    └── page.tsx            # アプリのルートページ

コンポーネント詳細
1. 認証関連
auth/config.ts
Microsoft認証のための構成ファイルです。環境変数から Azure AD のクライアントIDとテナントIDを取得します。
typescriptコピーexport const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`
  }
};
AuthProvider.tsx
Microsoft認証状態を管理し、アプリ全体で認証情報を利用できるようにするコンテキストプロバイダーです。

MSAL (Microsoft Authentication Library) を初期化
ログイン状態の管理
トークンの取得とアカウント情報の提供

LoginScreen.tsx
ログイン画面を表示し、ユーザーが認証済みの場合は AppContent コンポーネントに切り替えます。
2. レイアウト関連
AppContent.tsx
認証済みユーザー向けのメインアプリケーションレイアウトです。

左サイドバー (30%)：カレンダー、会議時間、ユーザー検索
メインコンテンツ (70%)：検索結果と予定表の表示

3. 機能コンポーネント
Calendar.tsx
日付選択のためのカレンダーUIです。特徴:

月の切り替え
日付範囲のドラッグ選択
選択した日付範囲の親コンポーネントへの通知

MeetingDuration.tsx
会議時間の選択コンポーネントです。30分〜3時間の選択肢があります。
UserSearch.tsx
ユーザー検索と選択機能を提供します。

Microsoft Graph APIでのユーザー検索
検索結果のフィルタリング
選択したユーザーの管理

ScheduleTable.tsx
日時ごとの参加者の空き状況を表示する核となるコンポーネントです。

日付と時間枠のグリッド表示
参加者ごとの空き状況表示（○/×）
会議依頼モーダルの表示と送信機能

SearchContent.tsx
検索インターフェースと結果表示を管理します。

検索ボタンと読み込み表示
検索結果として ScheduleTable を表示

MeetingInvite.tsx
会議依頼の作成と送信機能を提供します。

件名、本文、場所などの入力フォーム
Microsoft Graph APIを使った会議依頼の送信
Teams会議リンクの自動生成

アプリケーションフロー

ユーザーが Microsoft アカウントでログイン
サイドバーで以下を選択:

カレンダーから日付
希望する会議時間
参加者


「予定を検索する」ボタンをクリック
参加者の空き状況が表示される
適切な時間枠を選んで会議依頼を送信

注意点

環境変数 NEXT_PUBLIC_AZURE_CLIENT_ID と NEXT_PUBLIC_AZURE_TENANT_ID の設定が必要です
Microsoft Graph API の適切なアクセス許可が必要です:

User.Read
User.ReadBasic.All
Calendars.ReadWrite
Calendars.Read.Shared



このアプリケーションは、チーム内での会議調整を効率化し、Microsoft 365環境と統合して使いやすいスケジュール調整ツールを提供します。

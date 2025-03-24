# ほぼ調整さん (Almost Scheduler)

Microsoft 365と連携した会議スケジュール調整アプリケーション

## 概要

「ほぼ調整さん」は会議スケジュール調整を効率化するウェブアプリケーションです。Microsoft認証を利用してユーザーの予定表と連携し、参加者の空き状況を可視化して簡単に会議依頼を送信できます。

## 機能

- Microsoft アカウントでのログイン連携
- カレンダーからの日付選択
- 会議時間の設定（30分〜3時間）
- 組織内のユーザー検索と選択
- 参加者の空き状況の一覧表示
- Teams会議リンク付き会議依頼の送信

## アプリケーション構造
```bash
src/
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
```

## コンポーネント詳細

### 認証関連

- **auth/config.ts**: Microsoft認証の構成
- **AuthProvider.tsx**: 認証状態管理コンテキスト
- **LoginScreen.tsx**: ログイン画面

### レイアウト

- **AppContent.tsx**: メインアプリレイアウト（サイドバーとコンテンツエリア）

### 機能コンポーネント

- **Calendar.tsx**: 日付選択カレンダー
- **MeetingDuration.tsx**: 会議時間設定
- **UserSearch.tsx**: ユーザー検索と選択
- **ScheduleTable.tsx**: 空き状況グリッド表示
- **SearchContent.tsx**: 検索インターフェース
- **MeetingInvite.tsx**: 会議依頼フォーム

## アプリケーションフロー

1. Microsoft アカウントでログイン
2. 日付、会議時間、参加者を選択
3. 「予定を検索する」ボタンをクリック
4. 参加者の空き状況が表示される
5. 適切な時間枠を選んで会議依頼を送信

## セットアップ

### 前提条件

- Node.js 18以上
- Microsoft 365開発者アカウント

### 環境変数

`.env.local`ファイルを作成し、以下の変数を設定してください：
NEXT_PUBLIC_AZURE_CLIENT_ID=your_client_id
NEXT_PUBLIC_AZURE_TENANT_ID=your_tenant_id
コピー
### インストールと実行

### 必要なAPI権限
Microsoft Azure ADアプリケーション登録で以下の権限を設定してください：

User.Read
User.ReadBasic.All
Calendars.ReadWrite
Calendars.Read.Shared

### 技術スタック

Next.js 14 (App Router)
TypeScript
Tailwind CSS
shadcn/ui
Microsoft Authentication Library (MSAL)
Microsoft Graph API

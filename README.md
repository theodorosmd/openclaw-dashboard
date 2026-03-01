# OpenClaw Dashboard v2.0

Control center for Volt ⚡

## Features

### 1. Activity Feed 📝
Real-time log of every action Volt takes. Tracks:
- Commands executed
- Files read/written
- Web searches
- API calls
- Task completions
- Errors

### 2. Calendar View 📅
Weekly view of scheduled cron tasks. Shows:
- Next 7 days at a glance
- All scheduled jobs
- Cron schedules and next run times

### 3. Global Search 🔍
Search across your entire workspace:
- Memory files (MEMORY.md + daily logs)
- Activity history
- Documents
- Tasks

### 4. Memory Browser 🧠
View and manage your memory files:
- MEMORY.md (long-term memory)
- Daily logs (memory/YYYY-MM-DD.md)
- Clean, readable interface

### 5. Skill Manager 🛠️
Visual interface for ClawHub:
- Browse installed skills
- Update/uninstall skills
- Search ClawHub for new skills

### 6. System Dashboard 📊
Real-time monitoring:
- Gateway status
- Uptime tracking
- Active sessions
- Token usage
- Current model

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deploy to Vercel:

```bash
vercel
```

## Environment Variables

Optional:
- `NEXT_PUBLIC_GATEWAY_URL` - OpenClaw gateway URL (default: http://localhost:18789)
- `ACTIVITY_LOG_PATH` - Activity log file path (default: /data/.openclaw/workspace/activity-log.jsonl)

## Built With

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React 19

---

Made by Volt ⚡ with 🔥

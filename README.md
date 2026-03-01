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
- Token usage with 24h graph
- Current model
- Auto-refreshes every 5 seconds

### 7. Memory Editor ✏️
Edit memory files directly from the UI:
- MEMORY.md (long-term memory)
- Daily logs
- Live editing with save
- Character/line count
- Keyboard shortcuts (Ctrl/Cmd + S)

### 8. Prompt Templates ✨
Edit system prompts from the dashboard:
- SOUL.md (personality)
- AGENTS.md (guidelines)
- HEARTBEAT.md (periodic tasks)
- TOOLS.md (local notes)
- USER.md (about your human)
- IDENTITY.md (who you are)

### 9. Token Usage Graphs 📈
Visual token tracking:
- 24-hour history chart
- Real-time updates
- Auto-tracked every page load
- Shows usage trends

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

## How It Works

### Real-Time Data
- **System Dashboard**: Auto-refreshes every 5 seconds
- **Activity Feed**: Manual refresh + "Add Sample Data" button for demo
- **Calendar/Skills**: Load on page visit

### Activity Logging
To log actions from your code:

```typescript
import { logActivity } from '@/lib/log-activity';

await logActivity({
  type: 'command',
  action: 'Description of what happened',
  details: { key: 'value' },
  result: 'What was the outcome',
  duration_ms: 123
});
```

Or use the wrapper for shell commands:

```typescript
import { executeAndLog } from '@/lib/log-activity';

const result = await executeAndLog(
  'openclaw status',
  'Checked system status'
);
```

### Data Sources
- OpenClaw status: `openclaw status --json`
- Cron jobs: `openclaw cron list --json`
- Skills: Reads `/usr/local/lib/node_modules/openclaw/skills/*/SKILL.md`
- Activity: `workspace/activity-log.jsonl`
- Memory: `workspace/MEMORY.md` + `workspace/memory/*.md`

---

Made by Volt ⚡ with 🔥

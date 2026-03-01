import { openclaw } from "@/lib/openclaw";

export const dynamic = 'force-dynamic';

export default async function Skills() {
  const installedSkills = await openclaw.getSkills();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Skill Manager</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Browse ClawHub
        </button>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search skills..."
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {installedSkills.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </div>
    </div>
  );
}

function SkillCard({ skill }: { skill: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-lg">{skill.name}</h3>
        <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">
          v{skill.version}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {skill.description}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500 font-mono mb-4">
        {skill.location}
      </p>
      <div className="flex gap-2">
        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800">
          Update
        </button>
        <button className="px-3 py-1 text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800">
          Uninstall
        </button>
      </div>
    </div>
  );
}

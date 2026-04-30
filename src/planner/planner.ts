type Task = {
  readonly id: string;
  description: string;
  estDuration: number; // min
  priority: 1 | 2 | 3; // 1 = low, 2 = medium, 3 = high
  effortLevel: 1 | 2 | 3; // 1 = low, 2 = medium, 3 = high
  dueDate?: Date;
};

function scheduleTasks(tasks: Task[]): Task[] {
  const INTERVAL_DURATION_MINUTES = 15;
  const TOTAL_DAILY_INTERVALS = (24 * 60) / INTERVAL_DURATION_MINUTES; // 96 intervals of 15 minutes in a day
  const MAX_DAILY_EFFORT = 5;

  const prioritizedTasks = prioritizeTasks(tasks);
  const scheduledTasks: Task[] = new Array(TOTAL_DAILY_INTERVALS);

  let currentDayEffort = 0;
  let currentIntervalIndex = 0;

  while (prioritizedTasks.length > 0 && currentDayEffort < MAX_DAILY_EFFORT) {
    const availableConsecutiveIntervals = countAvailableConsecutiveIntervals(
      scheduledTasks,
      currentIntervalIndex,
    );

    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
      const taskRequiredIntervals =
        tasks[taskIndex].estDuration / INTERVAL_DURATION_MINUTES;
      const totalEffortAfterTask =
        tasks[taskIndex].effortLevel + currentDayEffort;

      if (
        taskRequiredIntervals <= availableConsecutiveIntervals &&
        totalEffortAfterTask <= MAX_DAILY_EFFORT
      ) {
        scheduledTasks[currentIntervalIndex] = tasks[taskIndex];
        tasks.splice(taskIndex, 1);
        currentDayEffort = totalEffortAfterTask;
        currentIntervalIndex += taskRequiredIntervals;
        break;
      }
    }
  }

  return scheduledTasks;
}

function planDay(tasks: Task[]) {
  const MAX_DAILY_EFFORT = 5;
  const prioritizedTasks = prioritizeTasks(tasks);
  let totalEffort = 0;
  let taskIndex = 0;

  for (
    ;
    taskIndex < tasks.length && calculateScore(tasks[taskIndex]) > 30;
    taskIndex++
  )
    totalEffort += tasks[taskIndex].effortLevel;
  const mustDo = prioritizedTasks.slice(0, taskIndex);
  console.log("Must do tasks: ", mustDo);

  const leftover = [];
  if (totalEffort >= MAX_DAILY_EFFORT)
    console.log("No other tasks recommended for today");
  else {
    const recommended = [];
    for (
      ;
      taskIndex < tasks.length && totalEffort < MAX_DAILY_EFFORT;
      taskIndex++
    ) {
      const totalEffortAfterTask = totalEffort + tasks[taskIndex].effortLevel;
      if (totalEffortAfterTask <= MAX_DAILY_EFFORT) {
        recommended.push(tasks[taskIndex]);
        totalEffort = totalEffortAfterTask;
      } else leftover.push(tasks[taskIndex]);
    }
    console.log("Recommended tasks: ", recommended);
  }

  leftover.push(...prioritizedTasks.slice(taskIndex));
  console.log("Task still remaining: ", leftover);
}

function countAvailableConsecutiveIntervals(
  scheduledTasks: Task[],
  startIndex: number,
): number {
  let currentIndex = startIndex;
  for (; currentIndex < scheduledTasks.length; currentIndex++) {
    if (scheduledTasks[currentIndex]) {
      break;
    }
  }
  return currentIndex - startIndex;
}

function prioritizeTasks(tasks: Task[]): Task[] {
  return tasks.sort((a, b) => {
    return calculateScore(b) - calculateScore(a);
  });
}

function calculateScore(task: Task): number {
  let score = 0;
  score += task.priority * 10;

  if (task.dueDate) {
    const now = Date.now();
    const due = task.dueDate.getTime();
    const daysLeft = (due - now) / (1000 * 60 * 60 * 24); // dividing by 1000ms, 60s, 60min, 24hr to get days

    if (daysLeft < 1)
      score += 30; // due today or overdue
    else if (daysLeft < 4)
      score += 15; // due tomorrow or the day after
    else if (daysLeft < 7) score += 8; // due in a week
  }

  return score;
}
const testTasks: Task[] = [
  {
    id: "task-1",
    description: "Finish project proposal",
    estDuration: 120,
    priority: 3,
    effortLevel: 2,
    dueDate: new Date("2026-05-05T09:00:00"),
  },
  {
    id: "task-2",
    description: "Email client update",
    estDuration: 30,
    priority: 2,
    effortLevel: 1,
    dueDate: new Date("2026-04-30T08:00:00"),
  },
  {
    id: "task-3",
    description: "Prepare meeting notes",
    estDuration: 45,
    priority: 1,
    effortLevel: 1,
  },
  {
    id: "task-4",
    description: "Design review",
    estDuration: 90,
    priority: 2,
    effortLevel: 3,
    dueDate: new Date("2026-06-27T10:00:00"),
  },
  {
    id: "task-5",
    description: "Code cleanup",
    estDuration: 60,
    priority: 2,
    effortLevel: 2,
  },
];

const res = planDay(testTasks);
// console.log(res);

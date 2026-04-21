import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// -------------------------------------------------------------------
// SYSTEM USER
// -------------------------------------------------------------------

async function getOrCreateSystemUser() {
  const existing = await db.user.findUnique({
    where: { clerkId: "system_seed_user" },
  });

  if (existing) return existing;

  return db.user.create({
    data: {
      clerkId: "system_seed_user",
      email: "seed@codearena.local",
      role: "ADMIN",
      firstName: "System",
      lastName: "Seed",
    },
  });
}

// -------------------------------------------------------------------
// PROBLEMS
// -------------------------------------------------------------------

const PROBLEMS = [
  // ===============================================================
  // 1. TWO SUM — Array — EASY
  // ===============================================================
  {
    title: "Two Sum",
    difficulty: "EASY",
    primaryTag: "Array",
    tags: ["Array", "HashMap"],
    companies: ["GOOGLE", "AMAZON", "MICROSOFT"],
    expectedTime: 900,
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. The input is provided as two lines: the first line contains space-separated integers, the second line contains the target. Output the two indices space-separated.",
    constraints:
      "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nExactly one valid answer exists.",
    examples: {
      JAVASCRIPT: {
        input: "2 7 11 15\n9",
        output: "0 1",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9, so we return [0, 1].",
      },
      PYTHON: {
        input: "2 7 11 15\n9",
        output: "0 1",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9, so we return [0, 1].",
      },
      JAVA: {
        input: "2 7 11 15\n9",
        output: "0 1",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9, so we return [0, 1].",
      },
    },
    testCases: [
      { input: "2 7 11 15\n9", output: "0 1" },
      { input: "3 2 4\n6", output: "1 2" },
      { input: "3 3\n6", output: "0 1" },
      { input: "-1 -2 -3 -4 -5\n-8", output: "2 4" },
    ],
    codeSnippets: {
      JAVASCRIPT: `const lines = require('fs').readFileSync(0, 'utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);
const target = parseInt(lines[1]);

function twoSum(nums, target) {
  // Write your code here
}

const result = twoSum(nums, target);
console.log(result.join(' '));`,
      PYTHON: `import sys
lines = sys.stdin.read().strip().split('\\n')
nums = list(map(int, lines[0].split()))
target = int(lines[1])

def two_sum(nums, target):
    # Write your code here
    pass

result = two_sum(nums, target)
print(' '.join(map(str, result)))`,
      JAVA: `import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().split(" ");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);
        int target = Integer.parseInt(sc.nextLine().trim());
        int[] result = twoSum(nums, target);
        System.out.println(result[0] + " " + result[1]);
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `const lines = require('fs').readFileSync(0, 'utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);
const target = parseInt(lines[1]);

function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}

console.log(twoSum(nums, target).join(' '));`,
      PYTHON: "# Reference solution",
      JAVA: "// Reference solution",
    },
  },

  // ===============================================================
  // 2. VALID PARENTHESES — Stack — EASY
  // ===============================================================
  {
    title: "Valid Parentheses",
    difficulty: "EASY",
    primaryTag: "Stack",
    tags: ["Stack", "String"],
    companies: ["GOOGLE", "MICROSOFT"],
    expectedTime: 900,
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, and open brackets are closed in the correct order. Print 'true' or 'false'.",
    constraints:
      "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.",
    examples: {
      JAVASCRIPT: {
        input: "()[]{}",
        output: "true",
        explanation: "All brackets are closed in the correct order.",
      },
      PYTHON: {
        input: "()[]{}",
        output: "true",
        explanation: "All brackets are closed in the correct order.",
      },
      JAVA: {
        input: "()[]{}",
        output: "true",
        explanation: "All brackets are closed in the correct order.",
      },
    },
    testCases: [
      { input: "()", output: "true" },
      { input: "()[]{}", output: "true" },
      { input: "(]", output: "false" },
      { input: "([)]", output: "false" },
      { input: "{[]}", output: "true" },
    ],
    codeSnippets: {
      JAVASCRIPT: `const s = require('fs').readFileSync(0, 'utf8').trim();

function isValid(s) {
  // Write your code here
}

console.log(isValid(s) ? "true" : "false");`,
      PYTHON: `import sys
s = sys.stdin.read().strip()

def is_valid(s):
    # Write your code here
    pass

print("true" if is_valid(s) else "false")`,
      JAVA: `import java.util.*;

public class Main {
    public static boolean isValid(String s) {
        // Write your code here
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(isValid(s) ? "true" : "false");
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `const s = require('fs').readFileSync(0, 'utf8').trim();

function isValid(s) {
  const stack = [];
  const map = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else if (stack.pop() !== map[ch]) return false;
  }
  return stack.length === 0;
}

console.log(isValid(s) ? "true" : "false");`,
      PYTHON: "# Reference solution",
      JAVA: "// Reference solution",
    },
  },

  // ===============================================================
  // 3. REVERSE LINKED LIST — LinkedList — EASY
  // ===============================================================
  {
    title: "Reverse Linked List",
    difficulty: "EASY",
    primaryTag: "LinkedList",
    tags: ["LinkedList", "Recursion"],
    companies: ["AMAZON", "MICROSOFT"],
    expectedTime: 900,
    description:
      "Given the values of a singly linked list as space-separated integers on one line, reverse the list and print the reversed values space-separated. If the input is empty, print an empty line.",
    constraints:
      "0 <= list length <= 5000\n-5000 <= Node.val <= 5000",
    examples: {
      JAVASCRIPT: {
        input: "1 2 3 4 5",
        output: "5 4 3 2 1",
        explanation: "The list 1->2->3->4->5 becomes 5->4->3->2->1.",
      },
      PYTHON: {
        input: "1 2 3 4 5",
        output: "5 4 3 2 1",
        explanation: "The list 1->2->3->4->5 becomes 5->4->3->2->1.",
      },
      JAVA: {
        input: "1 2 3 4 5",
        output: "5 4 3 2 1",
        explanation: "The list 1->2->3->4->5 becomes 5->4->3->2->1.",
      },
    },
    testCases: [
      { input: "1 2 3 4 5", output: "5 4 3 2 1" },
      { input: "1 2", output: "2 1" },
      { input: "7", output: "7" },
      { input: "-1 -2 -3", output: "-3 -2 -1" },
    ],
    codeSnippets: {
      JAVASCRIPT: `const input = require('fs').readFileSync(0, 'utf8').trim();
const nums = input.length ? input.split(' ').map(Number) : [];

function reverseList(nums) {
  // Write your code here
}

console.log(reverseList(nums).join(' '));`,
      PYTHON: `import sys
data = sys.stdin.read().strip()
nums = list(map(int, data.split())) if data else []

def reverse_list(nums):
    # Write your code here
    pass

print(' '.join(map(str, reverse_list(nums))))`,
      JAVA: `import java.util.*;

public class Main {
    public static int[] reverseList(int[] nums) {
        // Write your code here
        return nums;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.hasNextLine() ? sc.nextLine().trim() : "";
        int[] nums = line.isEmpty() ? new int[0] :
            Arrays.stream(line.split(" ")).mapToInt(Integer::parseInt).toArray();
        int[] result = reverseList(nums);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.length; i++) {
            if (i > 0) sb.append(" ");
            sb.append(result[i]);
        }
        System.out.println(sb.toString());
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `const input = require('fs').readFileSync(0, 'utf8').trim();
const nums = input.length ? input.split(' ').map(Number) : [];

function reverseList(nums) {
  return nums.slice().reverse();
}

console.log(reverseList(nums).join(' '));`,
      PYTHON: "# Reference solution",
      JAVA: "// Reference solution",
    },
  },

  // ===============================================================
  // 4. MAXIMUM SUBARRAY — Array (Kadane) — EASY
  // ===============================================================
  {
    title: "Maximum Subarray",
    difficulty: "EASY",
    primaryTag: "Array",
    tags: ["Array", "DynamicProgramming"],
    companies: ["AMAZON", "MICROSOFT", "GOOGLE"],
    expectedTime: 900,
    description:
      "Given an integer array nums (space-separated on one line), find the contiguous subarray with the largest sum and return that sum.",
    constraints:
      "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
    examples: {
      JAVASCRIPT: {
        input: "-2 1 -3 4 -1 2 1 -5 4",
        output: "6",
        explanation: "The subarray [4, -1, 2, 1] has the largest sum = 6.",
      },
      PYTHON: {
        input: "-2 1 -3 4 -1 2 1 -5 4",
        output: "6",
        explanation: "The subarray [4, -1, 2, 1] has the largest sum = 6.",
      },
      JAVA: {
        input: "-2 1 -3 4 -1 2 1 -5 4",
        output: "6",
        explanation: "The subarray [4, -1, 2, 1] has the largest sum = 6.",
      },
    },
    testCases: [
      { input: "-2 1 -3 4 -1 2 1 -5 4", output: "6" },
      { input: "1", output: "1" },
      { input: "5 4 -1 7 8", output: "23" },
      { input: "-1 -2 -3 -4", output: "-1" },
    ],
    codeSnippets: {
      JAVASCRIPT: `const nums = require('fs').readFileSync(0, 'utf8').trim().split(' ').map(Number);

function maxSubArray(nums) {
  // Write your code here
}

console.log(maxSubArray(nums));`,
      PYTHON: `import sys
nums = list(map(int, sys.stdin.read().strip().split()))

def max_sub_array(nums):
    # Write your code here
    pass

print(max_sub_array(nums))`,
      JAVA: `import java.util.*;

public class Main {
    public static int maxSubArray(int[] nums) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] nums = Arrays.stream(sc.nextLine().trim().split(" "))
            .mapToInt(Integer::parseInt).toArray();
        System.out.println(maxSubArray(nums));
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `const nums = require('fs').readFileSync(0, 'utf8').trim().split(' ').map(Number);

function maxSubArray(nums) {
  let best = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}

console.log(maxSubArray(nums));`,
      PYTHON: "# Reference solution",
      JAVA: "// Reference solution",
    },
  },

  // ===============================================================
  // 5. BINARY SEARCH — BinarySearch — EASY
  // ===============================================================
  {
    title: "Binary Search",
    difficulty: "EASY",
    primaryTag: "BinarySearch",
    tags: ["BinarySearch", "Array"],
    companies: ["GOOGLE", "AMAZON"],
    expectedTime: 900,
    description:
      "Given a sorted array of distinct integers (space-separated on line 1) and a target value (line 2), return the index of target if it exists in the array. Otherwise, return -1.",
    constraints:
      "1 <= nums.length <= 10^4\n-10^4 <= nums[i], target <= 10^4\nnums is sorted in ascending order.",
    examples: {
      JAVASCRIPT: {
        input: "-1 0 3 5 9 12\n9",
        output: "4",
        explanation: "9 exists in nums and its index is 4.",
      },
      PYTHON: {
        input: "-1 0 3 5 9 12\n9",
        output: "4",
        explanation: "9 exists in nums and its index is 4.",
      },
      JAVA: {
        input: "-1 0 3 5 9 12\n9",
        output: "4",
        explanation: "9 exists in nums and its index is 4.",
      },
    },
    testCases: [
      { input: "-1 0 3 5 9 12\n9", output: "4" },
      { input: "-1 0 3 5 9 12\n2", output: "-1" },
      { input: "5\n5", output: "0" },
      { input: "1 2 3 4 5\n1", output: "0" },
      { input: "1 2 3 4 5\n5", output: "4" },
    ],
    codeSnippets: {
      JAVASCRIPT: `const lines = require('fs').readFileSync(0, 'utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);
const target = parseInt(lines[1]);

function search(nums, target) {
  // Write your code here
}

console.log(search(nums, target));`,
      PYTHON: `import sys
lines = sys.stdin.read().strip().split('\\n')
nums = list(map(int, lines[0].split()))
target = int(lines[1])

def search(nums, target):
    # Write your code here
    pass

print(search(nums, target))`,
      JAVA: `import java.util.*;

public class Main {
    public static int search(int[] nums, int target) {
        // Write your code here
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] nums = Arrays.stream(sc.nextLine().trim().split(" "))
            .mapToInt(Integer::parseInt).toArray();
        int target = Integer.parseInt(sc.nextLine().trim());
        System.out.println(search(nums, target));
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `const lines = require('fs').readFileSync(0, 'utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);
const target = parseInt(lines[1]);

function search(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const m = (l + r) >> 1;
    if (nums[m] === target) return m;
    if (nums[m] < target) l = m + 1;
    else r = m - 1;
  }
  return -1;
}

console.log(search(nums, target));`,
      PYTHON: "# Reference solution",
      JAVA: "// Reference solution",
    },
  },
  // ===============================================================
  // 6. VALID ANAGRAM — HashMap — EASY
  // ===============================================================
  {
    title: "Valid Anagram",
    difficulty: "EASY",
    primaryTag: "HashMap",
    tags: ["HashMap", "String"],
    companies: ["AMAZON", "MICROSOFT"],
    expectedTime: 900,
    description:
      "Given two strings s and t (each on its own line), return 'true' if t is an anagram of s, and 'false' otherwise. An anagram is a word formed by rearranging the letters of another, using all original letters exactly once.",
    constraints:
      "1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters.",
    examples: {
      JAVASCRIPT: {
        input: "anagram\nnagaram",
        output: "true",
        explanation: "Both strings contain the same letters with the same counts.",
      },
      PYTHON: {
        input: "anagram\nnagaram",
        output: "true",
        explanation: "Both strings contain the same letters with the same counts.",
      },
      JAVA: {
        input: "anagram\nnagaram",
        output: "true",
        explanation: "Both strings contain the same letters with the same counts.",
      },
    },
    testCases: [
      { input: "anagram\nnagaram", output: "true" },
      { input: "rat\ncar", output: "false" },
      { input: "a\na", output: "true" },
      { input: "ab\na", output: "false" },
    ],
    codeSnippets: {
      JAVASCRIPT: `const lines = require('fs').readFileSync(0, 'utf8').split('\\n');
const s = lines[0];
const t = lines[1] || '';

function isAnagram(s, t) {
  // Write your code here
}

console.log(isAnagram(s, t) ? "true" : "false");`,
      PYTHON: `import sys
lines = sys.stdin.read().split('\\n')
s = lines[0]
t = lines[1] if len(lines) > 1 else ''

def is_anagram(s, t):
    # Write your code here
    pass

print("true" if is_anagram(s, t) else "false")`,
      JAVA: `import java.util.*;

public class Main {
    public static boolean isAnagram(String s, String t) {
        // Write your code here
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        String t = sc.hasNextLine() ? sc.nextLine() : "";
        System.out.println(isAnagram(s, t) ? "true" : "false");
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `const lines = require('fs').readFileSync(0, 'utf8').split('\\n');
const s = lines[0];
const t = lines[1] || '';

function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (const c of t) {
    if (!count[c]) return false;
    count[c]--;
  }
  return true;
}

console.log(isAnagram(s, t) ? "true" : "false");`,
      PYTHON: "# Reference solution",
      JAVA: "// Reference solution",
    },
  },

  // ===============================================================
  // 7. CLIMBING STAIRS — DynamicProgramming — EASY
  // ===============================================================
  {
    title: "Climbing Stairs",
    difficulty: "EASY",
    primaryTag: "DynamicProgramming",
    tags: ["DynamicProgramming", "Recursion"],
    companies: ["AMAZON", "GOOGLE"],
    expectedTime: 900,
    description:
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. Given n (one integer on a single line), return the number of distinct ways you can climb to the top.",
    constraints: "1 <= n <= 45",
    examples: {
      JAVASCRIPT: {
        input: "3",
        output: "3",
        explanation: "Three ways: 1+1+1, 1+2, 2+1.",
      },
      PYTHON: {
        input: "3",
        output: "3",
        explanation: "Three ways: 1+1+1, 1+2, 2+1.",
      },
      JAVA: {
        input: "3",
        output: "3",
        explanation: "Three ways: 1+1+1, 1+2, 2+1.",
      },
    },
    testCases: [
      { input: "2", output: "2" },
      { input: "3", output: "3" },
      { input: "1", output: "1" },
      { input: "5", output: "8" },
      { input: "10", output: "89" },
    ],
    codeSnippets: {
      JAVASCRIPT: `const n = parseInt(require('fs').readFileSync(0, 'utf8').trim());

function climbStairs(n) {
  // Write your code here
}

console.log(climbStairs(n));`,
      PYTHON: `import sys
n = int(sys.stdin.read().strip())

def climb_stairs(n):
    # Write your code here
    pass

print(climb_stairs(n))`,
      JAVA: `import java.util.*;

public class Main {
    public static int climbStairs(int n) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        System.out.println(climbStairs(n));
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `const n = parseInt(require('fs').readFileSync(0, 'utf8').trim());

function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}

console.log(climbStairs(n));`,
      PYTHON: "# Reference solution",
      JAVA: "// Reference solution",
    },
  },

  // ===============================================================
  // 8. INVERT BINARY TREE — Tree — EASY
  // ===============================================================
  {
    title: "Invert Binary Tree",
    difficulty: "EASY",
    primaryTag: "Tree",
    tags: ["Tree", "Recursion"],
    companies: ["GOOGLE", "MICROSOFT"],
    expectedTime: 900,
    description:
      "Given the level-order traversal of a binary tree (space-separated values on one line, using 'null' for missing nodes), invert the tree by swapping every left and right child. Return the inverted tree in level-order, trimming trailing 'null' values.",
    constraints:
      "0 <= number of nodes <= 100\n-100 <= Node.val <= 100",
    examples: {
      JAVASCRIPT: {
        input: "4 2 7 1 3 6 9",
        output: "4 7 2 9 6 3 1",
        explanation: "Left and right children are swapped at every level.",
      },
      PYTHON: {
        input: "4 2 7 1 3 6 9",
        output: "4 7 2 9 6 3 1",
        explanation: "Left and right children are swapped at every level.",
      },
      JAVA: {
        input: "4 2 7 1 3 6 9",
        output: "4 7 2 9 6 3 1",
        explanation: "Left and right children are swapped at every level.",
      },
    },
    testCases: [
      { input: "4 2 7 1 3 6 9", output: "4 7 2 9 6 3 1" },
      { input: "2 1 3", output: "2 3 1" },
      { input: "", output: "" },
      { input: "1", output: "1" },
    ],
    codeSnippets: {
      JAVASCRIPT: `const input = require('fs').readFileSync(0, 'utf8').trim();
const tokens = input.length ? input.split(' ') : [];

function invertAndSerialize(tokens) {
  // Write your code here
}

console.log(invertAndSerialize(tokens));`,
      PYTHON: `import sys
data = sys.stdin.read().strip()
tokens = data.split() if data else []

def invert_and_serialize(tokens):
    # Write your code here
    pass

print(invert_and_serialize(tokens))`,
      JAVA: `import java.util.*;

public class Main {
    public static String invertAndSerialize(String[] tokens) {
        // Write your code here
        return "";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.hasNextLine() ? sc.nextLine().trim() : "";
        String[] tokens = line.isEmpty() ? new String[0] : line.split(" ");
        System.out.println(invertAndSerialize(tokens));
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `const input = require('fs').readFileSync(0, 'utf8').trim();
const tokens = input.length ? input.split(' ') : [];

function buildTree(tokens) {
  if (tokens.length === 0) return null;
  const root = { val: parseInt(tokens[0]), left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < tokens.length) {
    const node = queue.shift();
    if (i < tokens.length && tokens[i] !== 'null') {
      node.left = { val: parseInt(tokens[i]), left: null, right: null };
      queue.push(node.left);
    }
    i++;
    if (i < tokens.length && tokens[i] !== 'null') {
      node.right = { val: parseInt(tokens[i]), left: null, right: null };
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function invert(node) {
  if (!node) return null;
  const l = invert(node.left);
  const r = invert(node.right);
  node.left = r;
  node.right = l;
  return node;
}

function serialize(root) {
  if (!root) return '';
  const out = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node === null) {
      out.push('null');
    } else {
      out.push(String(node.val));
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  while (out.length && out[out.length - 1] === 'null') out.pop();
  return out.join(' ');
}

console.log(serialize(invert(buildTree(tokens))));`,
      PYTHON: "# Reference solution",
      JAVA: "// Reference solution",
    },
  },

  // ===============================================================
  // 9. LONGEST SUBSTRING WITHOUT REPEATING — SlidingWindow — MEDIUM
  // ===============================================================
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "MEDIUM",
    primaryTag: "SlidingWindow",
    tags: ["SlidingWindow", "String", "HashMap"],
    companies: ["AMAZON", "GOOGLE", "MICROSOFT"],
    expectedTime: 1500,
    description:
      "Given a string s (one line), find the length of the longest substring without repeating characters. If the input is empty, return 0.",
    constraints:
      "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
    examples: {
      JAVASCRIPT: {
        input: "abcabcbb",
        output: "3",
        explanation: "The answer is 'abc' with length 3.",
      },
      PYTHON: {
        input: "abcabcbb",
        output: "3",
        explanation: "The answer is 'abc' with length 3.",
      },
      JAVA: {
        input: "abcabcbb",
        output: "3",
        explanation: "The answer is 'abc' with length 3.",
      },
    },
    testCases: [
      { input: "abcabcbb", output: "3" },
      { input: "bbbbb", output: "1" },
      { input: "pwwkew", output: "3" },
      { input: "", output: "0" },
      { input: "dvdf", output: "3" },
    ],
    codeSnippets: {
      JAVASCRIPT: `const raw = require('fs').readFileSync(0, 'utf8');
const s = raw.endsWith('\\n') ? raw.slice(0, -1) : raw;

function lengthOfLongestSubstring(s) {
  // Write your code here
}

console.log(lengthOfLongestSubstring(s));`,
      PYTHON: `import sys
s = sys.stdin.read()
if s.endswith('\\n'):
    s = s[:-1]

def length_of_longest_substring(s):
    # Write your code here
    pass

print(length_of_longest_substring(s))`,
      JAVA: `import java.util.*;

public class Main {
    public static int lengthOfLongestSubstring(String s) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        System.out.println(lengthOfLongestSubstring(s));
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `const raw = require('fs').readFileSync(0, 'utf8');
const s = raw.endsWith('\\n') ? raw.slice(0, -1) : raw;

function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let best = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (seen.has(c) && seen.get(c) >= left) left = seen.get(c) + 1;
    seen.set(c, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

console.log(lengthOfLongestSubstring(s));`,
      PYTHON: "# Reference solution",
      JAVA: "// Reference solution",
    },
  },

  // ===============================================================
  // 10. CONTAINER WITH MOST WATER — TwoPointers — MEDIUM
  // ===============================================================
  {
    title: "Container With Most Water",
    difficulty: "MEDIUM",
    primaryTag: "TwoPointers",
    tags: ["TwoPointers", "Array"],
    companies: ["AMAZON", "GOOGLE"],
    expectedTime: 1500,
    description:
      "Given n non-negative integers representing heights (space-separated on one line), find two lines that together with the x-axis form a container holding the most water. Return the maximum area.",
    constraints:
      "n == heights.length\n2 <= n <= 10^5\n0 <= heights[i] <= 10^4",
    examples: {
      JAVASCRIPT: {
        input: "1 8 6 2 5 4 8 3 7",
        output: "49",
        explanation: "Lines at indices 1 and 8 with heights 8 and 7 form area = min(8,7) * (8-1) = 49.",
      },
      PYTHON: {
        input: "1 8 6 2 5 4 8 3 7",
        output: "49",
        explanation: "Lines at indices 1 and 8 with heights 8 and 7 form area = min(8,7) * (8-1) = 49.",
      },
      JAVA: {
        input: "1 8 6 2 5 4 8 3 7",
        output: "49",
        explanation: "Lines at indices 1 and 8 with heights 8 and 7 form area = min(8,7) * (8-1) = 49.",
      },
    },
    testCases: [
      { input: "1 8 6 2 5 4 8 3 7", output: "49" },
      { input: "1 1", output: "1" },
      { input: "4 3 2 1 4", output: "16" },
      { input: "1 2 1", output: "2" },
    ],
    codeSnippets: {
      JAVASCRIPT: `const heights = require('fs').readFileSync(0, 'utf8').trim().split(' ').map(Number);

function maxArea(heights) {
  // Write your code here
}

console.log(maxArea(heights));`,
      PYTHON: `import sys
heights = list(map(int, sys.stdin.read().strip().split()))

def max_area(heights):
    # Write your code here
    pass

print(max_area(heights))`,
      JAVA: `import java.util.*;

public class Main {
    public static int maxArea(int[] heights) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] heights = Arrays.stream(sc.nextLine().trim().split(" "))
            .mapToInt(Integer::parseInt).toArray();
        System.out.println(maxArea(heights));
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `const heights = require('fs').readFileSync(0, 'utf8').trim().split(' ').map(Number);

function maxArea(heights) {
  let l = 0, r = heights.length - 1, best = 0;
  while (l < r) {
    const area = Math.min(heights[l], heights[r]) * (r - l);
    if (area > best) best = area;
    if (heights[l] < heights[r]) l++;
    else r--;
  }
  return best;
}

console.log(maxArea(heights));`,
      PYTHON: "# Reference solution",
      JAVA: "// Reference solution",
    },
  },
  // ===============================================================
  // 11. NUMBER OF ISLANDS — Graph — MEDIUM
  // ===============================================================
  {
    title: "Number of Islands",
    difficulty: "MEDIUM",
    primaryTag: "Graph",
    tags: ["Graph", "Recursion", "Array"],
    companies: ["AMAZON", "GOOGLE", "MICROSOFT"],
    expectedTime: 1500,
    description:
      "Given an m x n 2D binary grid representing a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. The first line contains two integers m and n separated by space. The next m lines each contain n characters (0 or 1) with no separators.",
    constraints:
      "m == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j] is '0' or '1'.",
    examples: {
      JAVASCRIPT: {
        input: "4 5\n11110\n11010\n11000\n00000",
        output: "1",
        explanation: "All 1's form a single connected island.",
      },
      PYTHON: {
        input: "4 5\n11110\n11010\n11000\n00000",
        output: "1",
        explanation: "All 1's form a single connected island.",
      },
      JAVA: {
        input: "4 5\n11110\n11010\n11000\n00000",
        output: "1",
        explanation: "All 1's form a single connected island.",
      },
    },
    testCases: [
      { input: "4 5\n11110\n11010\n11000\n00000", output: "1" },
      { input: "4 5\n11000\n11000\n00100\n00011", output: "3" },
      { input: "1 1\n0", output: "0" },
      { input: "1 1\n1", output: "1" },
      { input: "3 3\n101\n010\n101", output: "5" },
    ],
    codeSnippets: {
      JAVASCRIPT: `const lines = require('fs').readFileSync(0, 'utf8').trim().split('\\n');
const [m, n] = lines[0].split(' ').map(Number);
const grid = lines.slice(1, 1 + m).map(row => row.split(''));

function numIslands(grid) {
  // Write your code here
}

console.log(numIslands(grid));`,
      PYTHON: `import sys
lines = sys.stdin.read().strip().split('\\n')
m, n = map(int, lines[0].split())
grid = [list(line) for line in lines[1:1 + m]]

def num_islands(grid):
    # Write your code here
    pass

print(num_islands(grid))`,
      JAVA: `import java.util.*;

public class Main {
    public static int numIslands(char[][] grid) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] dims = sc.nextLine().trim().split(" ");
        int m = Integer.parseInt(dims[0]);
        int n = Integer.parseInt(dims[1]);
        char[][] grid = new char[m][n];
        for (int i = 0; i < m; i++) grid[i] = sc.nextLine().toCharArray();
        System.out.println(numIslands(grid));
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `const lines = require('fs').readFileSync(0, 'utf8').trim().split('\\n');
const [m, n] = lines[0].split(' ').map(Number);
const grid = lines.slice(1, 1 + m).map(row => row.split(''));

function numIslands(grid) {
  const rows = grid.length, cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}

console.log(numIslands(grid));`,
      PYTHON: "# Reference solution",
      JAVA: "// Reference solution",
    },
  },

  // ===============================================================
  // 12. GROUP ANAGRAMS — HashMap — MEDIUM
  // ===============================================================
  {
    title: "Group Anagrams",
    difficulty: "MEDIUM",
    primaryTag: "HashMap",
    tags: ["HashMap", "String"],
    companies: ["AMAZON", "MICROSOFT"],
    expectedTime: 1500,
    description:
      "Given an array of strings (space-separated on one line), group the anagrams together. Return each group on its own line with words space-separated. Groups should be sorted by their first occurrence in the input. Within each group, words must appear in their original input order.",
    constraints:
      "1 <= strs.length <= 10^4\n0 <= strs[i].length <= 100\nstrs[i] consists of lowercase English letters.",
    examples: {
      JAVASCRIPT: {
        input: "eat tea tan ate nat bat",
        output: "eat tea ate\ntan nat\nbat",
        explanation: "Anagram groups: {eat,tea,ate}, {tan,nat}, {bat}.",
      },
      PYTHON: {
        input: "eat tea tan ate nat bat",
        output: "eat tea ate\ntan nat\nbat",
        explanation: "Anagram groups: {eat,tea,ate}, {tan,nat}, {bat}.",
      },
      JAVA: {
        input: "eat tea tan ate nat bat",
        output: "eat tea ate\ntan nat\nbat",
        explanation: "Anagram groups: {eat,tea,ate}, {tan,nat}, {bat}.",
      },
    },
    testCases: [
      { input: "eat tea tan ate nat bat", output: "eat tea ate\ntan nat\nbat" },
      { input: "a", output: "a" },
      { input: "abc bca cab xyz", output: "abc bca cab\nxyz" },
      { input: "listen silent enlist", output: "listen silent enlist" },
    ],
    codeSnippets: {
      JAVASCRIPT: `const strs = require('fs').readFileSync(0, 'utf8').trim().split(' ');

function groupAnagrams(strs) {
  // Return an array of arrays. Preserve first-occurrence order.
}

console.log(groupAnagrams(strs).map(g => g.join(' ')).join('\\n'));`,
      PYTHON: `import sys
strs = sys.stdin.read().strip().split()

def group_anagrams(strs):
    # Return a list of lists. Preserve first-occurrence order.
    pass

groups = group_anagrams(strs)
print('\\n'.join(' '.join(g) for g in groups))`,
      JAVA: `import java.util.*;

public class Main {
    public static List<List<String>> groupAnagrams(String[] strs) {
        // Write your code here
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] strs = sc.nextLine().trim().split(" ");
        List<List<String>> groups = groupAnagrams(strs);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < groups.size(); i++) {
            if (i > 0) sb.append("\\n");
            sb.append(String.join(" ", groups.get(i)));
        }
        System.out.println(sb.toString());
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `const strs = require('fs').readFileSync(0, 'utf8').trim().split(' ');

function groupAnagrams(strs) {
  const map = new Map();
  const order = [];
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key).push(s);
  }
  return order.map(k => map.get(k));
}

console.log(groupAnagrams(strs).map(g => g.join(' ')).join('\\n'));`,
      PYTHON: "# Reference solution",
      JAVA: "// Reference solution",
    },
  },

  // ===============================================================
  // 13. LONGEST PALINDROMIC SUBSTRING — String — MEDIUM
  // ===============================================================
  {
    title: "Longest Palindromic Substring",
    difficulty: "MEDIUM",
    primaryTag: "String",
    tags: ["String", "DynamicProgramming"],
    companies: ["AMAZON", "GOOGLE"],
    expectedTime: 1500,
    description:
      "Given a string s (one line), return the longest palindromic substring in s. If multiple palindromes of the same maximum length exist, return the one that starts earliest in the string.",
    constraints:
      "1 <= s.length <= 1000\ns consists of only digits and English letters.",
    examples: {
      JAVASCRIPT: {
        input: "babad",
        output: "bab",
        explanation: "'bab' is a palindrome of length 3. 'aba' also valid but 'bab' starts earlier.",
      },
      PYTHON: {
        input: "babad",
        output: "bab",
        explanation: "'bab' is a palindrome of length 3. 'aba' also valid but 'bab' starts earlier.",
      },
      JAVA: {
        input: "babad",
        output: "bab",
        explanation: "'bab' is a palindrome of length 3. 'aba' also valid but 'bab' starts earlier.",
      },
    },
    testCases: [
      { input: "babad", output: "bab" },
      { input: "cbbd", output: "bb" },
      { input: "a", output: "a" },
      { input: "ac", output: "a" },
      { input: "racecar", output: "racecar" },
    ],
    codeSnippets: {
      JAVASCRIPT: `const s = require('fs').readFileSync(0, 'utf8').trim();

function longestPalindrome(s) {
  // Write your code here
}

console.log(longestPalindrome(s));`,
      PYTHON: `import sys
s = sys.stdin.read().strip()

def longest_palindrome(s):
    # Write your code here
    pass

print(longest_palindrome(s))`,
      JAVA: `import java.util.*;

public class Main {
    public static String longestPalindrome(String s) {
        // Write your code here
        return "";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        System.out.println(longestPalindrome(s));
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `const s = require('fs').readFileSync(0, 'utf8').trim();

function longestPalindrome(s) {
  if (s.length < 2) return s;
  let start = 0, maxLen = 1;

  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if (r - l + 1 > maxLen) {
        maxLen = r - l + 1;
        start = l;
      }
      l--; r++;
    }
  }

  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.substring(start, start + maxLen);
}

console.log(longestPalindrome(s));`,
      PYTHON: "# Reference solution",
      JAVA: "// Reference solution",
    },
  },

  // ===============================================================
  // 14. COIN CHANGE — DynamicProgramming — MEDIUM
  // ===============================================================
  {
    title: "Coin Change",
    difficulty: "MEDIUM",
    primaryTag: "DynamicProgramming",
    tags: ["DynamicProgramming", "Array"],
    companies: ["AMAZON", "GOOGLE"],
    expectedTime: 1500,
    description:
      "Given a list of coin denominations (space-separated on line 1) and a target amount (line 2), return the fewest number of coins needed to make up that amount. If the amount cannot be made, return -1. Each coin may be used any number of times.",
    constraints:
      "1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4",
    examples: {
      JAVASCRIPT: {
        input: "1 2 5\n11",
        output: "3",
        explanation: "11 = 5 + 5 + 1 (3 coins).",
      },
      PYTHON: {
        input: "1 2 5\n11",
        output: "3",
        explanation: "11 = 5 + 5 + 1 (3 coins).",
      },
      JAVA: {
        input: "1 2 5\n11",
        output: "3",
        explanation: "11 = 5 + 5 + 1 (3 coins).",
      },
    },
    testCases: [
      { input: "1 2 5\n11", output: "3" },
      { input: "2\n3", output: "-1" },
      { input: "1\n0", output: "0" },
      { input: "1 2 5\n100", output: "20" },
      { input: "186 419 83 408\n6249", output: "20" },
    ],
    codeSnippets: {
      JAVASCRIPT: `const lines = require('fs').readFileSync(0, 'utf8').trim().split('\\n');
const coins = lines[0].split(' ').map(Number);
const amount = parseInt(lines[1]);

function coinChange(coins, amount) {
  // Write your code here
}

console.log(coinChange(coins, amount));`,
      PYTHON: `import sys
lines = sys.stdin.read().strip().split('\\n')
coins = list(map(int, lines[0].split()))
amount = int(lines[1])

def coin_change(coins, amount):
    # Write your code here
    pass

print(coin_change(coins, amount))`,
      JAVA: `import java.util.*;

public class Main {
    public static int coinChange(int[] coins, int amount) {
        // Write your code here
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] coins = Arrays.stream(sc.nextLine().trim().split(" "))
            .mapToInt(Integer::parseInt).toArray();
        int amount = Integer.parseInt(sc.nextLine().trim());
        System.out.println(coinChange(coins, amount));
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `const lines = require('fs').readFileSync(0, 'utf8').trim().split('\\n');
const coins = lines[0].split(' ').map(Number);
const amount = parseInt(lines[1]);

function coinChange(coins, amount) {
  const INF = amount + 1;
  const dp = new Array(amount + 1).fill(INF);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
}

console.log(coinChange(coins, amount));`,
      PYTHON: "# Reference solution",
      JAVA: "// Reference solution",
    },
  },

  // ===============================================================
  // 15. HOUSE ROBBER — DynamicProgramming — MEDIUM
  // ===============================================================
  {
    title: "House Robber",
    difficulty: "MEDIUM",
    primaryTag: "DynamicProgramming",
    tags: ["DynamicProgramming", "Array"],
    companies: ["AMAZON", "MICROSOFT"],
    expectedTime: 1500,
    description:
      "You are a robber planning to rob houses along a street. Each house has a certain amount of money stashed. You cannot rob two adjacent houses or the alarm will trigger. Given the amount of money in each house (space-separated on one line), return the maximum amount you can rob tonight without alerting the police.",
    constraints:
      "1 <= nums.length <= 100\n0 <= nums[i] <= 400",
    examples: {
      JAVASCRIPT: {
        input: "1 2 3 1",
        output: "4",
        explanation: "Rob house 0 (money=1) and house 2 (money=3). Total = 4.",
      },
      PYTHON: {
        input: "1 2 3 1",
        output: "4",
        explanation: "Rob house 0 (money=1) and house 2 (money=3). Total = 4.",
      },
      JAVA: {
        input: "1 2 3 1",
        output: "4",
        explanation: "Rob house 0 (money=1) and house 2 (money=3). Total = 4.",
      },
    },
    testCases: [
      { input: "1 2 3 1", output: "4" },
      { input: "2 7 9 3 1", output: "12" },
      { input: "5", output: "5" },
      { input: "2 1 1 2", output: "4" },
      { input: "0", output: "0" },
    ],
    codeSnippets: {
      JAVASCRIPT: `const nums = require('fs').readFileSync(0, 'utf8').trim().split(' ').map(Number);

function rob(nums) {
  // Write your code here
}

console.log(rob(nums));`,
      PYTHON: `import sys
nums = list(map(int, sys.stdin.read().strip().split()))

def rob(nums):
    # Write your code here
    pass

print(rob(nums))`,
      JAVA: `import java.util.*;

public class Main {
    public static int rob(int[] nums) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] nums = Arrays.stream(sc.nextLine().trim().split(" "))
            .mapToInt(Integer::parseInt).toArray();
        System.out.println(rob(nums));
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `const nums = require('fs').readFileSync(0, 'utf8').trim().split(' ').map(Number);

function rob(nums) {
  let prev = 0, curr = 0;
  for (const n of nums) {
    const next = Math.max(curr, prev + n);
    prev = curr;
    curr = next;
  }
  return curr;
}

console.log(rob(nums));`,
      PYTHON: "# Reference solution",
      JAVA: "// Reference solution",
    },
  },
];

// -------------------------------------------------------------------
// MAIN
// -------------------------------------------------------------------

async function main() {
  console.log("🌱 Starting seed...");

  const systemUser = await getOrCreateSystemUser();
  console.log(`✓ System user ready: ${systemUser.email}`);

  let created = 0;
  let skipped = 0;

  for (const problem of PROBLEMS) {
    const existing = await db.problem.findFirst({
      where: { title: problem.title },
      select: { id: true },
    });

    if (existing) {
      console.log(`  ⏭  Skipped (exists): ${problem.title}`);
      skipped++;
      continue;
    }

    await db.problem.create({
      data: {
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        tags: problem.tags,
        userId: systemUser.id,
        companies: problem.companies,
        primaryTag: problem.primaryTag,
        expectedTime: problem.expectedTime,
        examples: problem.examples,
        constraints: problem.constraints,
        testCases: problem.testCases,
        codeSnippets: problem.codeSnippets,
        referenceSolutions: problem.referenceSolutions,
      },
    });

    console.log(`  ✓ Created: ${problem.title} (${problem.difficulty} · ${problem.primaryTag})`);
    created++;
  }

  console.log("");
  console.log("─".repeat(50));
  console.log(`✅ Seed complete`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total:   ${PROBLEMS.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
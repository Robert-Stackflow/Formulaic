---
title: 哈希表
description: 哈希表的基本原理、常用实现、典型题解等常用技巧
---

## 哈希表基础知识

- 哈希表（Hash Table）也叫散列表，是一种通过 “键（Key）” 直接映射到 “值（Value）” 的数据结构

- 哈希表的核心目标是：用 O (1) 的平均时间复杂度实现增删改查（理想情况）

- 一般哈希表用来快速判断一个元素是否出现集合里

- 哈希函数（Hash Function）：把任意类型的 Key（比如字符串、数字、对象）转换成数组的下标（整数）

- 哈希冲突（Hash Collision）：不同的 Key，通过哈希函数算出了同一个下标（比如 key=13 和 key=23，都算出下标 3）

- 冲突解决办法

  | 方法               | 核心逻辑                                                                               | 优点                   | 缺点                                         |
  | :----------------- | :------------------------------------------------------------------------------------- | :--------------------- | :------------------------------------------- |
  | 链地址法（拉链法） | 每个格子里不是存一个值，而是挂一个链表 / 红黑树；冲突的 Key 都存在同一个格子的链表中   | 实现简单，扩容方便     | 链表过长会导致查询变慢（优化：链表转红黑树） |
  | 开放寻址法         | 冲突后，按规则找下一个空格子（比如线性探测：下标 + 1、+2…；二次探测：下标 + 1²、+2²…） | 无需额外空间，缓存友好 | 容易出现 “聚集”，数组满了后性能暴跌          |

- 例如，Java 的 HashMap 用的是「链地址法」（链表 + 红黑树），Python 的字典（dict）用的是「开放寻址法」

- 使用哈希思想解决问题时，最常用的三种结构：
  - 数组（最简单、范围有限时首选）
  - set（集合）：只存 key，不存 value
  - map（映射）：存储 key-value 键值对

- 三种 set 对比

  | 容器                 | 底层   | 是否有序 | 允许重复 key | 查询 / 增删效率 | 选择                  |
  | :------------------- | :----- | :------- | :----------- | :-------------- | --------------------- |
  | `std::set`           | 红黑树 | 有序     | 不允许       | O(log n)        | 需要 key 有序         |
  | `std::multiset`      | 红黑树 | 有序     | 允许         | O(log n)        | 需要有序 + 可重复 key |
  | `std::unordered_set` | 哈希表 | 无序     | 不允许       | O (1) 平均      | 最快增删查            |

- 三种 map 对比

  | 容器                 | 底层   | key 是否有序 | key 可重复 | 查询 / 增删效率 | 选择          |
  | :------------------- | :----- | :----------- | :--------- | :-------------- | ------------- |
  | `std::map`           | 红黑树 | 有序         | 不可重复   | O(log n)        | key 有序      |
  | `std::multimap`      | 红黑树 | 有序         | 可重复     | O(log n)        | 允许 key 重复 |
  | `std::unordered_map` | 哈希表 | 无序         | 不可重复   | O (1) 平均      | 最快查找key   |

  ## 基础用法

- 有效的字母异位词
  - 给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词（即 s 和 t 的所用的字母及数量完全一致）

  - 参考题目
    - [242. 有效的字母异位词](https://leetcode.cn/problems/valid-anagram/description/)

    - [49. 字母异位词分组](https://leetcode.cn/problems/group-anagrams/?envType=study-plan-v2&envId=top-100-liked)

  - 对于这种 key 的数量固定可以枚举的情况，可以使用数组来充当哈希表的角色

  - 代码实现

    ```cpp
    class Solution {
    public:
        bool isAnagram(string s, string t) {
            int record[26] = {0};
            for (int i = 0; i < s.size(); i++) {
                // 并不需要记住字符a的ASCII，只要求出一个相对数值就可以了
                record[s[i] - 'a']++;
            }
            for (int i = 0; i < t.size(); i++) {
                record[t[i] - 'a']--;
            }
            for (int i = 0; i < 26; i++) {
                if (record[i] != 0) {
                    // record数组如果有的元素不为零0，说明字符串s和t 一定是谁多了字符或者谁少了字符。
                    return false;
                }
            }
            // record数组所有元素都为零0，说明字符串s和t是字母异位词
            return true;
        }
    };
    ```

- 赎金信
  - 给你两个字符串：`ransomNote` 和 `magazine` ，判断 `ransomNote` 能不能由 `magazine` 里面的字符构成

  - `magazine` 中的每个字符只能在 `ransomNote` 中使用一次

  - 可以统计 `magazine` 中每个字母出现的次数，遍历 `ransomNote`，每遍历一个字符即减去对应的次数，如果次数小于 0 则说明无法组成

  - 参考题目：[383. 赎金信](https://leetcode.cn/problems/ransom-note/description/)

  - 示例代码

    ```cpp
    class Solution {
    public:
        bool canConstruct(string ransomNote, string magazine) {
            int record[26] = {0};
            //add
            if (ransomNote.size() > magazine.size()) {
                return false;
            }
            for (int i = 0; i < magazine.length(); i++) {
                // 通过record数据记录 magazine里各个字符出现次数
                record[magazine[i]-'a'] ++;
            }
            for (int j = 0; j < ransomNote.length(); j++) {
                // 遍历ransomNote，在record里对应的字符个数做--操作
                record[ransomNote[j]-'a']--;
                // 如果小于零说明ransomNote里出现的字符，magazine没有
                if(record[ransomNote[j]-'a'] < 0) {
                    return false;
                }
            }
            return true;
        }
    };
    ```

- 两个数组的交集
  - 给定两个数组，编写函数来计算交集（交集也是一种集合，一定是元素唯一的）

  - 参考题目：[349. 两个数组的交集](https://leetcode.cn/problems/intersection-of-two-arrays/)

  - 这种没有限制数值的大小，且如果哈希值比较少、特别分散、跨度特别大，使用数组就会浪费空间，因此可以考虑哈希表

  - 这里并不要求 key 是有序的，且不让数据重复，因此可以使用 unordered_set

  - 当然也可以使用 unordered_map，但是这里不需要统计每个数字出现的次数，可以直接使用集合

  - 代码实现

    ```cpp
    class Solution {
    public:
        vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
            unordered_set<int> result_set; // 存放结果，之所以用set是为了给结果集去重
            unordered_set<int> nums_set(nums1.begin(), nums1.end());
            for (int num : nums2) {
                // 发现nums2的元素 在nums_set里又出现过
                if (nums_set.find(num) != nums_set.end()) {
                    result_set.insert(num);
                }
            }
            return vector<int>(result_set.begin(), result_set.end());
        }
    };
    ```

- 快乐数
  - 编写一个算法来判断一个数 n 是不是快乐数

  - 「快乐数」定义为：对于一个正整数，每一次将该数替换为它每个位置上的数字的平方和，然后重复这个过程直到这个数变为 1，也可能是**无限循环**但始终变不到 1。如果可以变为 1，那么这个数就是快乐数

  - 参考题目：[202. 快乐数](https://leetcode.cn/problems/happy-number/)

  - 这里的关键是求和的过程中，可能会出现一个求出来的和值是会重复出现的，因此可以通过 unordered_map 来统计每次求出来的和所出现的次数，当次数 >1 时就可以立刻结束循环，说明该数字不是快乐数

  - 代码实现

    ```cpp
    class Solution {
    public:
        // 取数值各个位上的单数之和
        int getSum(int n) {
            int sum = 0;
            while (n) {
                sum += (n % 10) * (n % 10);
                n /= 10;
            }
            return sum;
        }
        bool isHappy(int n) {
            unordered_set<int> set;
            while(1) {
                int sum = getSum(n);
                if (sum == 1) {
                    return true;
                }
                // 如果这个sum曾经出现过，说明已经陷入了无限循环了，立刻return false
                if (set.find(sum) != set.end()) {
                    return false;
                } else {
                    set.insert(sum);
                }
                n = sum;
            }
        }
    };
    ```

  - 其时空复杂度均为 $O(\log n)$

## 两数之和

- 给定一个整数数组 nums 和一个目标值 target，在该数组中找出和为目标值的那两个整数，并返回他们的数组下标，数组中的同一个元素不能使用两遍

- 可以对数组中的元素进行哈希，对于每个整数 num，寻找 target-num 是否在数组中即可

- 应该先查询是否有匹配，再插入到哈希表中，来避免同一个元素被重复使用

- 代码实现

  ```cpp
  class Solution {
  public:
      vector<int> twoSum(vector<int>& nums, int target) {
          std::unordered_map <int,int> map;
          for(int i = 0; i < nums.size(); i++) {
              // 遍历当前元素，并在map中寻找是否有匹配的key
              auto iter = map.find(target - nums[i]);
              if(iter != map.end()) {
                  return {iter->second, i};
              }
              // 如果没找到匹配对，就把访问过的元素和下标加入到map中
              map.insert(pair<int, int>(nums[i], i));
          }
          return {};
      }
  };
  ```

- 参考题目
  - [1. 两数之和](https://leetcode.cn/problems/two-sum/description/)
  - [167. 两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/description/)

## 三数之和

- 给定一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？找出所有满足条件且不重复的三元组

- 类似两数之和问题，可以用两层循环，先确定 a 和 b，然后判断 0-(a+b) 是否存在，但是题目要求不可以包含重复的三元组；如果先把符合条件的三元组放进 vector 中，然后再去重会比较耗费时间

- 示例代码

  ```cpp
  class Solution {
  public:
      // 在一个数组中找到3个数形成的三元组，它们的和为0，不能重复使用（三数下标互不相同），且三元组不能重复。
      // b（存储）== 0-(a+c)（检索）
      vector<vector<int>> threeSum(vector<int>& nums) {
          vector<vector<int>> result;
          sort(nums.begin(), nums.end());

          for (int i = 0; i < nums.size(); i++) {
              // 如果a是正数，a<b<c，不可能形成和为0的三元组
              if (nums[i] > 0)
                  break;

              // [a, a, ...] 如果本轮a和上轮a相同，那么找到的b，c也是相同的，所以去重a
              if (i > 0 && nums[i] == nums[i - 1])
                  continue;

              // 这个set的作用是存储b
              unordered_set<int> set;

              for (int k = i + 1; k < nums.size(); k++) {
                  // 去重b=c时的b和c
                  if (k > i + 2 && nums[k] == nums[k - 1] && nums[k - 1] == nums[k - 2])
                      continue;

                  // a+b+c=0 <=> b=0-(a+c)
                  int target = 0 - (nums[i] + nums[k]);
                  if (set.find(target) != set.end()) {
                      result.push_back({nums[i], target, nums[k]});   // nums[k]成为c
                      set.erase(target);
                  }
                  else {
                      set.insert(nums[k]);                            // nums[k]成为b
                  }
              }
          }

          return result;
      }
  };
  ```

- 实际上，这道题目不适合用哈希表来解决，而可以通过「排序 + 双指针」来解决，因为排序天然地规避了重复
  - 排序数组：排序后相同元素相邻，便于去重；且可通过指针移动控制和的大小
  - 固定第一个数：遍历数组，将 `nums[i]` 作为三元组第一个数，转化为「在 i 右侧找两数之和 = -nums [i]」的问题
  - 双指针找后两个数：用左指针 `left = i+1`、右指针 `right = n-1`，根据 `nums[i]+nums[left]+nums[right]` 的和调整指针：
    - 和 < 0 → 左指针右移（增大和）；
    - 和 > 0 → 右指针左移（减小和）；
    - 和 = 0 → 记录三元组，同时跳过重复元素；
  - 全程去重：避免相同的第一个数、相同的左 / 右指针值导致重复三元组

- 代码实现

  ```cpp
  #include <vector>
  #include <algorithm> // 排序需要
  using namespace std;

  class Solution {
  public:
      vector<vector<int>> threeSum(vector<int>& nums) {
          vector<vector<int>> result;
          int n = nums.size();
          // 边界处理：数组长度小于3，直接返回空
          if (n < 3) return result;

          // 步骤1：排序数组（核心，为去重和双指针做准备）
          sort(nums.begin(), nums.end());

          // 步骤2：遍历固定第一个数 nums[i]
          for (int i = 0; i < n; ++i) {
              // 去重1：第一个数重复，跳过（避免重复三元组）
              if (i > 0 && nums[i] == nums[i-1]) {
                  continue;
              }
              // 错误去重a方法，将会漏掉-1,-1,2 这种情况
              /*
              if (nums[i] == nums[i + 1]) {
                  continue;
              }
              */
              // 剪枝：排序后第一个数>0，后续数都≥它，和不可能为0
              if (nums[i] > 0) {
                  break;
              }

              // 步骤3：双指针找后两个数
              int left = i + 1;
              int right = n - 1;
              while (left < right) {
                  int sum = nums[i] + nums[left] + nums[right];
                  if (sum < 0) {
                      // 和太小，左指针右移增大和
                      left++;
                  } else if (sum > 0) {
                      // 和太大，右指针左移减小和
                      right--;
                  } else {
                      // 找到符合条件的三元组，加入结果
                      result.push_back({nums[i], nums[left], nums[right]});

                      // 去重2：左指针重复，跳过
                      while (left < right && nums[left] == nums[left+1]) {
                          left++;
                      }
                      // 去重3：右指针重复，跳过
                      while (left < right && nums[right] == nums[right-1]) {
                          right--;
                      }

                      // 指针同时移动，找下一组可能的数
                      left++;
                      right--;
                  }
              }
          }
          return result;
      }
  };
  ```

- 对于两数之和问题
  - 原始问题返回下标，数组无序：不推荐双指针法，哈希表法是最优解
  - 假如返回数值，数组可排序：可以用双指针法，空间复杂度更低

- 即对于有序数组的两数之和（[167. 两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/)），其代码实现

  ```cpp
  #include <vector>
  using namespace std;

  class Solution {
  public:
      vector<int> twoSumSorted(vector<int>& nums, int target) {
          int left = 0;
          int right = nums.size() - 1;
          while (left < right) {
              int sum = nums[left] + nums[right];
              if (sum == target) {
                  return {nums[left], nums[right]}; // 返回数值，而非下标
              } else if (sum < target) {
                  left++;
              } else {
                  right--;
              }
          }
          return {};
      }
  };
  ```

## 四数之和

- 给定一个包含 n 个整数的数组 nums 和一个目标值 target，判断 nums 中是否存在四个元素 a，b，c 和 d ，使得 a + b + c + d 的值与 target 相等？找出所有满足条件且不重复的四元组

- 四数之和的解法和三数之和的解法类似，可以使用两层 for 循环来解决

  ```cpp
  class Solution {
  public:
      vector<vector<int>> fourSum(vector<int>& nums, int target) {
          vector<vector<int>> result;
          sort(nums.begin(), nums.end());
          for (int k = 0; k < nums.size(); k++) {
              // 剪枝处理
              if (nums[k] > target && nums[k] >= 0) {
              	break; // 这里使用break，统一通过最后的return返回
              }
              // 对nums[k]去重
              if (k > 0 && nums[k] == nums[k - 1]) {
                  continue;
              }
              for (int i = k + 1; i < nums.size(); i++) {
                  // 2级剪枝处理
                  if (nums[k] + nums[i] > target && nums[k] + nums[i] >= 0) {
                      break;
                  }

                  // 对nums[i]去重
                  if (i > k + 1 && nums[i] == nums[i - 1]) {
                      continue;
                  }
                  int left = i + 1;
                  int right = nums.size() - 1;
                  while (right > left) {
                      // nums[k] + nums[i] + nums[left] + nums[right] > target 会溢出
                      if ((long) nums[k] + nums[i] + nums[left] + nums[right] > target) {
                          right--;
                      // nums[k] + nums[i] + nums[left] + nums[right] < target 会溢出
                      } else if ((long) nums[k] + nums[i] + nums[left] + nums[right]  < target) {
                          left++;
                      } else {
                          result.push_back(vector<int>{nums[k], nums[i], nums[left], nums[right]});
                          // 对nums[left]和nums[right]去重
                          while (right > left && nums[right] == nums[right - 1]) right--;
                          while (right > left && nums[left] == nums[left + 1]) left++;

                          // 找到答案时，双指针同时收缩
                          right--;
                          left++;
                      }
                  }

              }
          }
          return result;
      }
  };
  ```

## 四数之和 Ⅱ

- 给定四个包含整数的数组列表 A , B , C , D ,计算有多少个元组 (i, j, k, l) ，使得 A[i] + B[j] + C[k] + D[l] = 0

- 为了使问题简单化，所有的 A, B, C, D 具有相同的长度 N，且 0 ≤ N ≤ 500 。所有整数的范围在 -2^28 到 2^28 - 1 之间，最终结果不会超过 2^31 - 1

- 这个问题与刚刚的四数之和问题不同，这道题是四个独立的数组，只要找到满足条件的即可

- 解题步骤
  - 哈希表统计 A+B 的和：遍历 A、B 所有组合，计算和 `sum_ab = A[i] + B[j]`，用 `unordered_map` 记录 `sum_ab` 出现的次数
  - 遍历 C+D 找补数：遍历 C、D 所有组合，计算和 `sum_cd = C[k] + D[l]`，找 `0 - sum_cd` 是否在哈希表中，若存在则累加对应次数到结果
  - 返回最终统计数

- 示例代码

  ```cpp
  #include <vector>
  #include <unordered_map>
  using namespace std;

  class Solution {
  public:
      int fourSumCount(vector<int>& A, vector<int>& B, vector<int>& C, vector<int>& D) {
          // 1. 定义哈希表：key = A[i]+B[j]，value = 该和出现的次数
          unordered_map<int, int> sum_ab_map;

          // 2. 遍历A和B，统计所有A[i]+B[j]的和及次数
          for (int a : A) {
              for (int b : B) {
                  int sum_ab = a + b;
                  sum_ab_map[sum_ab]++; // 次数+1
              }
          }

          // 3. 统计满足条件的元组数量
          int count = 0;
          for (int c : C) {
              for (int d : D) {
                  int sum_cd = c + d;
                  // 找补数：0 - sum_cd，若存在则累加次数
                  int target = 0 - sum_cd;
                  if (sum_ab_map.find(target) != sum_ab_map.end()) {
                      count += sum_ab_map[target];
                  }
              }
          }

          return count;
      }
  };
  ```

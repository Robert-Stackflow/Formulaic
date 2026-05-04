---
title: C++ 基础
description: C++ 基础语法、常用库函数和数据结构，算法题解的必备工具
---

## 头文件

- 常用头文件

  | 头文件                           | 核心作用                                                             |
  | :------------------------------- | :------------------------------------------------------------------- |
  | `#include <iostream>`            | 输入输出（cin/cout），算法题最基础的输入输出工具                     |
  | `#include <vector>`              | 动态数组（替代普通数组，无需手动管理内存，算法题中最常用的数据结构） |
  | `#include <algorithm>`           | 包含所有标准算法（排序、查找、最值、交换等），算法题的核心库         |
  | `#include <string>`              | 字符串处理（拼接、查找、截取等）                                     |
  | `#include <cmath>`               | 数学函数（绝对值、幂、开方、取整、三角函数等）                       |
  | `#include <climits>`             | 提供系统极值（如 INT_MAX/INT_MIN，避免手动定义最大值 / 最小值）      |
  | `#include <queue>`               | 队列（queue）、优先队列（priority_queue，常用于堆排序 / 贪心题）     |
  | `#include <stack>`               | 栈（stack），用于 DFS、括号匹配等题                                  |
  | `#include <map>/<unordered_map>` | 键值对映射（有序 / 无序，统计频率、哈希表场景）                      |
  | `#include <set>/<unordered_set>` | 集合（有序 / 无重复，去重、查找存在性）                              |
  | `#include <numeric>`             | 数值算法（如累加、累乘，少用但关键场景很方便）                       |

## 库函数

- 数值计算（\<cmath>）
  - 绝对值：`abs()`（int）、`fabs()`（double/float）
  - 取整：`floor()`（向下取整）、`ceil()`（向上取整）、`round()`（四舍五入）
  - 幂 / 开方：`pow(a, b)`（a 的 b 次方）、`sqrt(x)`（平方根）、`cbrt(x)`（立方根）
  - 最值：`max(a,b)`、`min(a,b)`（可直接比较两个数，algorithm 库也有）

- swap()：交换两个变量的值

  ```cpp
  int a=1, b=2;
  swap(a, b); // a=2, b=1
  ```

- accumulate()（\<numeric>）：累加容器元素（需指定初始值）

  ```cpp
  vector<int> nums = {1,2,3,4};
  int sum = accumulate(nums.begin(), nums.end(), 0); // 1+2+3+4=10
  ```

- reverse()（\<algorithm>）：反转容器元素顺序

  ```cpp
  vector<int> nums = {1,2,3,4};
  reverse(nums.begin(), nums.end()); // 结果：4 3 2 1
  // 也可以反转字符串
  string s = "hello";
  reverse(s.begin(), s.end()); // s 反转
  // 反转部分元素
  vector<int> nums2 = {1,2,3,4,5};
  reverse(nums2.begin() + 1, nums2.end() - 1); // 反转索引1到倒数第二个元素，结果：1 4 3 2 5
  // 反转二维矩阵的行
  vector<vector<int>> matrix = {{1,2,3}, {4,5,6}, {7,8,9}};
  for (auto& row : matrix) {
    reverse(row.begin(), row.end()); // 每行反转，结果：{{3,2,1}, {6,5,4}, {9,8,7}}
  }
  ```

- find()：查找元素，返回迭代器（找不到返回 end ()）

  ```cpp
  vector<int> nums = {1,2,3,4,5};
  auto it = find(nums.begin(), nums.end(), 3);
  if (it != nums.end()) {
      cout << "找到元素，索引：" << it - nums.begin() << endl; // 输出：2
  }
  ```

- binary_search()：二分查找（前提：容器已排序），返回 bool 值

  ```cpp
  vector<int> nums = {1,2,3,4,5};
  bool exist = binary_search(nums.begin(), nums.end(), 3); // true
  ```

- max_element() / min_element()（\<algorithm>）：获取容器中最大 / 最小元素的迭代器

  ```cpp
  vector<int> nums = {1,2,3,4};
  auto max_it = max_element(nums.begin(), nums.end()); // 指向最大元素4
  auto min_it = min_element(nums.begin(), nums.end()); // 指向最小元素1
  int max_val = *max_it; // 获取最大值4
  int min_val = *min_it; // 获取最小值1
  // 也可以配合自定义比较器获取满足特定条件的最大 / 最小元素
  vector<string> words = {"apple", "banana", "cherry"};
  auto longest_it = max_element(words.begin(), words.end(), [](const string& a, const string& b) {
    return a.length() < b.length(); // 按字符串长度比较，获取最长字符串
  });
  ```

- fill()（\<algorithm>）：填充容器元素为指定值

  ```cpp
  vector<int> nums(5); // 创建一个大小为5的vector，初始值为0
  fill(nums.begin(), nums.end(), 1); // 将所有元素填充为1，结果：1 1 1 1 1
  ```

- count() （\<algorithm>）：统计容器中某个值出现的次数

  ```cpp
  vector<int> nums = {1,2,3,4,5,2};
  int count_2 = count(nums.begin(), nums.end(), 2); // 统计2出现的次数，结果为2
  ```

- count_if()（\<algorithm>）：统计满足条件的元素个数

  ```cpp
  vector<int> nums = {1,2,3,4,5};
  int count_even = count_if(nums.begin(), nums.end(), [](int x) {
    return x % 2 == 0; // 统计偶数的个数
  });
  ```

- sort()（\<algorithm>）：排序容器元素，默认升序，可自定义比较规则

  ```cpp
  vector<int> nums = {5, 2, 9, 1, 5, 6};
  sort(nums.begin(), nums.end()); // 升序排序
  sort(nums.begin(), nums.end(), greater<int>()); // 降序排序
  sort(nums.begin(), nums.end(), [](int a, int b) { return abs(a) < abs(b); }); // 按绝对值排序
  sort(nums.begin(), nums.end(), [](int a, int b) { return a % 10 < b % 10; }); // 按个位数排序
  sort(nums.begin(), nums.end(), [](int a, int b) { return to_string(a) < to_string(b); }); // 按字符串形式排序
  sort(nums.begin(), nums.end(), [](int a, int b) {
    if (a % 2 != b % 2) return a % 2 < b % 2; // 奇数在前偶数在后
    return a < b; // 同为奇数或偶数则升序
  });
  vector<pair<int, int>> pairs = {{1, 2}, {3, 1}, {2, 3}};
  sort(pairs.begin(), pairs.end(), [](const pair<int, int>& p1, const pair<int, int>& p2) {
    if (p1.first != p2.first) return p1.first < p2.first; // 先按第一个元素升序
    return p1.second > p2.second; // 第一个元素相同则按第二个元素降序
  });
  string s = "hello";
  sort(s.begin(), s.end()); // s变为"ehllo"
  sort(s.begin(), s.end(), greater<char>()); // s变为"ollhe"
  sort(s.begin(), s.end(), [](char a, char b) { return tolower(a) < tolower(b); }); // 按字母顺序排序，忽略大小写
  sort(s.begin(), s.end(), [](char a, char b) {
    if (isalpha(a) && isalpha(b)) return tolower(a) < tolower(b); // 字母按字母顺序排序
    if (isalpha(a)) return true; // 字母在前
    if (isalpha(b)) return false; // 字母在前
    return a < b; // 其他字符按 ASCII 码排序
  });
  ```

- stable_sort()：稳定排序（保持相等元素的相对顺序），效率略低于 sort
- unique()（\<algorithm>）：去除容器中相邻的重复元素（需先排序）

  ```cpp
  vector<int> nums = {1,1,2,2,3,3};
  sort(nums.begin(), nums.end()); // 先排序
  auto it = unique(nums.begin(), nums.end()); // 去除相邻重复
  // unique 返回的迭代器指向去重后容器的末尾，需配合 erase 删除多余元素
  nums.erase(it, nums.end()); // 删除多余元素，结果：1 2 3
  // unique() 只去除相邻重复，所以如果不先排序，结果可能不正确
  vector<int> nums2 = {1,2,1,3,2,3};
  auto it2 = unique(nums2.begin(), nums2.end()); // 结果可能是 1 2 1 3 2 3（没有去除重复）
  // unique() 也可以配合自定义比较器去除满足特定条件的元素
  vector<string> words = {"apple", "Apple", "banana", "Banana"};
  sort(words.begin(), words.end(), [](const string& a, const string& b) {
    return tolower(a[0]) < tolower(b[0]); // 按首字母排序，忽略大小写
  });
  auto it3 = unique(words.begin(), words.end(), [](const string& a, const string& b) {
    return tolower(a[0]) == tolower(b[0]); // 去除首字母相同的元素
  });
  words.erase(it3, words.end()); // 结果可能是 "apple" "banana"（去除首字母相同的元素）
  // unique() 也可以配合 lambda 表达式实现更复杂的去重逻辑
  vector<int> nums3 = {1,2,3,4,5};
  auto it4 = unique(nums3.begin(), nums3.end(), [](int a, int b) {
    return (a + b) % 2 == 0; // 去除和为偶数的相邻元素
  });
  nums3.erase(it4, nums3.end()); // 结果可能是 1 2 4（去除和为偶数的相邻元素）
  ```

- lower_bound()/upper_bound()：二分查找，返回第一个不小于 / 大于目标值的迭代器（前提：容器已排序）

  ```cpp
  vector<int> nums = {1,2,4,4,5};
  auto it1 = lower_bound(nums.begin(), nums.end(), 4); // 指向第一个4
  auto it2 = upper_bound(nums.begin(), nums.end(), 4); // 指向第一个大于4的元素（5）
  int count = it2 - it1; // 统计4的出现次数，结果为2
  // 也可以配合自定义比较器使用
  vector<string> words = {"apple", "banana", "cherry"};
  sort(words.begin(), words.end()); // 先排序
  auto it3 = lower_bound(words.begin(), words.end(), "blueberry"); // 指向第一个不小于"blueberry"的元素（"cherry"）
  auto it4 = upper_bound(words.begin(), words.end(), "blueberry"); // 指向第一个大于"blueberry"的元素（"cherry"）
  // 如果容器中没有不小于 / 大于目标值的元素，lower_bound() / upper_bound() 返回 end() 迭代器
  auto it5 = lower_bound(words.begin(), words.end(), "zucchini"); // 指向 end()（没有不小于"zucchini"的元素）
  auto it6 = upper_bound(words.begin(), words.end(), "zucchini"); // 指向 end()（没有大于"zucchini"的元素）
  // 如果容器中所有元素都不小于 / 大于目标值，lower_bound() / upper_bound() 返回 begin() 迭代器
  auto it7 = lower_bound(words.begin(), words.end(), "aardvark"); // 指向 begin()（所有元素都不小于"aardvark"）
  auto it8 = upper_bound(words.begin(), words.end(), "aardvark"); // 指向 begin()（所有元素都大于"aardvark"）
  // 如果容器未排序，lower_bound() / upper_bound() 的行为未定义，结果可能不正确
  vector<int> unsorted_nums = {5,2,4,1,3};
  auto it9 = lower_bound(unsorted_nums.begin(), unsorted_nums.end(), 3); // 行为未定义，结果可能不正确
  auto it10 = upper_bound(unsorted_nums.begin(), unsorted_nums.end(), 3); // 行为未定义，结果可能不正确
  // lower_bound() / upper_bound() 也可以配合 lambda 表达式实现更复杂的查找逻辑
  vector<int> nums4 = {1,2,3,4,5};
  auto it11 = lower_bound(nums4.begin(), nums4.end(), 0, [](int a, int b) {
    return a < b; // 按照默认的升序比较
  }); // 指向第一个不小于0的元素（1）
  auto it12 = upper_bound(nums4.begin(), nums4.end(), 5, [](int a, int b) {
    return a < b; // 按照默认的升序比较
  }); // 指向第一个大于5的元素（没有，返回 end()）
  ```

- next_permutation()/prev_permutation()：生成下一个 / 上一个字典序排列

  ```cpp
  vector<int> nums = {1,2,3};
  next_permutation(nums.begin(), nums.end()); // 结果：1 3 2
  next_permutation(nums.begin(), nums.end()); // 结果：2 1 3
  prev_permutation(nums.begin(), nums.end()); // 结果：1 3 2
  prev_permutation(nums.begin(), nums.end()); // 结果：1 2 3（回到初始状态）
  ```

- to_string()：数字转字符串

  ```cpp
   int num = 123;
   string s_num = to_string(num); // "123"
   double pi = 3.14159;
   string s_pi = to_string(pi); // "3.141590"（默认保留6位小数）
   long long big_num = 1234567890123456789LL;
   string s_big_num = to_string(big_num); // "1234567890123456789"
   bool flag = true;
   string s_flag = to_string(flag); // "1"（true 转为 "1"，false 转为 "0"）
   char c = 'A';
   string s_char(1, c); // char 转 string，结果为 "A"
   string s_bool = to_string(false); // "0"
   string s_num2 = to_string(-456); // "-456"
   string s_num3 = to_string(0); // "0"
   string s_num4 = to_string(3.14); // "3.140000"
   string s_num5 = to_string(2.71828); // "2.718280"
   string s_num6 = to_string(1e-10); // "0.000000"（科学计数法转为小数时可能会丢失精度）
   string s_num7 = to_string(1e10); // "10000000000.000000"（科学计数法转为小数时可能会丢失精度）
   string s_num8 = to_string(1.23456789); // "1.234568"（默认保留6位小数，超出部分会四舍五入）
   string s_num9 = to_string(1.23456789e-5); // "0.000012"（科学计数法转为小数时可能会丢失精度）
   string s_num10 = to_string(1.23456789e5); // "123456.789000"（科学计数法转为小数时可能会丢失精度）
   string s_num11 = to_string(1.23456789e-10); // "0.000000"（科学计数法转为小数时可能会丢失精度）
   string s_num12 = to_string(1.23456789e10); // "12345678900.000000"（科学计数法转为小数时可能会丢失精度）
  ```

- sum()（\<numeric>）：C++17 新增，直接计算容器元素之和

  ```cpp
  vector<int> nums = {1,2,3,4};
  int sum = std::sum(nums); // 10
  ```

- enumerate()（C++20 结构化绑定 + enumerate）：同时获取元素索引和值

  ```cpp
  vector<string> words = {"hello", "world"};
  for (auto& [index, word] : enumerate(words)) {
    cout << index << ": " << word << endl;
  }
  ```

## 数据结构

- string（字符串）

  ```cpp
  string s = "hello";
  s += " world"; // 拼接字符串
  cout << s.length(); // 获取长度
  cout << s.size();   // 获取长度（同 length()）
  cout << s[0]; // 访问字符
  cout << s.substr(0, 5); // 截取子串 "hello"，从索引0开始，长度为5
  cout << s.find("world"); // 查找子串，返回索引
  cout << s.empty(); // 判断是否为空
  cout << s.clear(); // 清空字符串
  cout << s.c_str(); // 获取 C 风格字符串（const char*）
  cout << s.begin(); // 获取迭代器
  cout << s.end();   // 获取迭代器
  string num_str = to_string(123); // 数字转字符串
  int num = stoi("456"); // 字符串转数字
  int num2 = atoi("789"); // C 风格字符串转数字
  int num3 = stoi("123abc"); // 字符串转数字，遇到非数字停止，结果为123
  int num4 = stoi("abc123"); // 字符串转数字，开头非数字，抛出异常
  int num5 = stoi("2147483648"); // 字符串转数字，超出 int 范围，抛出异常
  int num6 = stoi("-2147483649"); // 字符串转数字，超出 int 范围，抛出异常
  int num7 = stoi("-123"); // 字符串转数字，负数，结果为-123
  int num8 = stoi("+123"); // 字符串转数字，正数，结果为123
  int num9 = stoi("   123"); // 字符串转数字，前面有空格，结果为123
  int num10 = stoi("123   "); // 字符串转数字，后面有空格，结果为123
  int num11 = stoi("   -123   "); // 字符串转数字，前后有空格，结果为-123
  int num12 = stoi("   +123   "); // 字符串转数字，前后有空格，结果为123
  string copy_s = s; // 复制字符串
  string move_s = std::move(s); // 移动字符串（s 变为空）
  string swap_s;
  swap(s, swap_s); // 交换字符串内容
  string sorted_s = s; // 复制字符串
  sort(sorted_s.begin(), sorted_s.end()); // 排序字符串
  string reversed_s = s; // 复制字符串
  reverse(reversed_s.begin(), reversed_s.end()); // 反转字符串
  string unique_s = s; // 复制字符串
  sort(unique_s.begin(), unique_s.end()); // 先排序
  unique_s.erase(unique(unique_s.begin(), unique_s.end()), unique_s.end()); // 去重
  for (char c : s) { // 遍历字符串
    cout << c << " ";
  }
  for (size_t i = 0; i < s.length(); i++) { // 通过索引访问字符
    cout << s[i] << " ";
  }
  for (auto it = s.begin(); it != s.end(); it++) { // 通过迭代器访问字符
  cout << *it << " ";
  }
  for (auto& c : s) { // 遍历字符串（引用避免复制）
  cout << c << " ";
  }
  for (auto& [index, c] : enumerate(s)) { // C++20 结构化绑定 + enumerate
  cout << index << ": " << c << endl;
  }
  string char2str(1, 'a'); // char 转 string
  char c = s[0]; // string 转 char
  ```

- vector（动态数组）

  ```cpp
  vector<int> vec;
  vec.push_back(1); // 尾部添加元素
  vec.pop_back();   // 尾部删除元素
  vec.size();       // 获取元素个数
  vec.empty();      // 判断是否为空
  vec.clear();      // 清空所有元素
  vec.resize(5);    // 调整大小为5（不足补默认值，超出截断）
  vec.begin();       // 获取迭代器
  vec.end();         // 获取迭代器
  vec[0];          // 访问元素（不检查越界）
  vec.at(0);       // 访问元素（检查越界，抛出异常）
  vec.insert(vec.begin() + 1, 10); // 在索引1位置插入10
  vec.erase(vec.begin() + 1); // 删除索引1位置的元素
  vec.clear(); // 清空所有元素
  vec.empty(); // 判断是否为空
  vec.emplace_back(2); // 直接构造元素（效率更高）
  vec.reserve(100); // 预留空间，避免频繁扩容
  vecotr<int> copy_vec(vec); // 复制 vector
  vector<int> assign_vec(5, 0); // 创建一个包含5个0的 vector
  vector<int> range_vec(vec.begin(), vec.begin() + 3); // 创建一个包含 vec 前3个元素的 vector
  vector<int> move_vec(std::move(vec)); // 移动 vector（vec 变为空）
  vector<int> swap_vec;
  swap(vec, swap_vec); // 交换两个 vector 的内容
  vector<int> sorted_vec = vec; // 复制 vector
  sort(sorted_vec.begin(), sorted_vec.end()); // 排序 vector
  vector<int> reversed_vec = vec; // 复制 vector
  reverse(reversed_vec.begin(), reversed_vec.end()); // 反转 vector
  vector<int> unique_vec = vec; // 复制 vector
  sort(unique_vec.begin(), unique_vec.end()); // 先排序
  unique_vec.erase(unique(unique_vec.begin(), unique_vec.end()), unique_vec.end()); // 去重
  for (int x : vec) { // 遍历 vector
    cout << x << " ";
  }
  for (size_t i = 0; i < vec.size(); i++) { // 通过索引访问元素
    cout << vec[i] << " ";
  }
  for (auto it = vec.begin(); it != vec.end(); it++) { // 通过迭代器访问元素
    cout << *it << " ";
  }
  for (auto& x : vec) { // 遍历 vector（引用避免复制）
    cout << x << " ";
  }
  for (auto& [index, value] : enumerate(vec)) { // C++20 结构化绑定 + enumerate
    cout << index << ": " << value << endl;
  }
  vector<int> vec2 = {1, 2, 3, 4}; // 列表初始化 vector
  vector<int> vec3{1, 2, 3, 4}; // 列表初始化 vector（C++11 语法）
  vector<int> vec4(5, 0); // 创建一个包含5个0的 vector
  ```

- deque（双端队列），支持两端插入删除，比 vector 更灵活

  ```cpp
  deque<int> dq;
  dq.push_back(1);               // 尾部添加
  dq.push_front(2);              // 前部添加
  dq.pop_back();                 // 尾部删除
  dq.pop_front();                // 前部删除
  dq.size();                     // 获取元素个数
  dq.empty();                    // 判断是否为空
  dq.clear();                    // 清空所有元素
  dq[0];                         // 访问元素（不检查越界）
  dq.at(0);                      // 访问元素（检查越界，抛出异常）
  dq.insert(dq.begin() + 1, 10); // 在索引1位置插入10
  dq.erase(dq.begin() + 1);      // 删除索引1位置的元素
  dq.emplace_front(3);           // 前部直接构造元素
  dq.emplace_back(4);            // 尾部直接构造元素
  deque<int> copy_dq(dq);        // 复制 deque
  deque<int> assign_dq(5, 0);    // 创建一个包含5个0的 deque
  deque<int> range_dq(dq.begin(),
                      dq.begin() + 3); // 创建一个包含 dq 前3个元素的 deque
  deque<int> move_dq(std::move(dq));   // 移动 deque（dq 变为空）
  deque<int> swap_dq;
  swap(dq, swap_dq);                               // 交换两个 deque 的内容
  deque<int> sorted_dq = dq;                       // 复制 deque
  sort(sorted_dq.begin(), sorted_dq.end());        // 排序 deque
  deque<int> reversed_dq = dq;                     // 复制 deque
  reverse(reversed_dq.begin(), reversed_dq.end()); // 反转 deque
  deque<int> unique_dq = dq;                       // 复制 deque
  sort(unique_dq.begin(), unique_dq.end());        // 先排序
  unique_dq.erase(unique(unique_dq.begin(), unique_dq.end()),
                  unique_dq.end()); // 去重
  for (int x : dq) {                // 遍历 deque
      cout << x << " ";
  }
  for (size_t i = 0; i < dq.size(); i++) { // 通过索引访问元素
      cout << dq[i] << " ";
  }
  for (auto it = dq.begin(); it != dq.end(); it++) { // 通过迭代器访问元素
      cout << *it << " ";
  }
  for (auto& x : dq) { // 遍历 deque（引用避免复制）
      cout << x << " ";
  }
  for (auto& [index, value] : enumerate(dq)) { // C++20 结构化绑定 + enumerate
      cout << index << ": " << value << endl;
  }
  ```

- stack（栈），后进先出（LIFO）

  ```cpp
  stack<int> st;
  st.push(1); // 入栈
  st.top();   // 获取栈顶元素
  st.pop();   // 出栈
  st.empty(); // 判断是否为空
  st.size();  // 获取元素个数
  st.emplace(2); // 直接构造元素（效率更高）
  stack<int> copy_st(st); // 复制 stack
  stack<int> move_st(std::move(st)); // 移动 stack（st 变为空）
  stack<int> swap_st;
  swap(st, swap_st); // 交换两个 stack 的内容
  for (stack<int> temp = st; !temp.empty(); temp.pop()) { // 遍历 stack（需要复制一份）
  	cout << temp.top() << " ";
  }
  while (!st.empty()) { // 通过循环访问栈顶元素
  	cout << st.top() << " ";	st.pop();
  }
  ```

- queue（队列），先进先出（FIFO）

  ```cpp
  queue<int> q;
  q.push(1); // 入队
  q.front(); // 获取队头元素
  q.pop();   // 出队
  q.empty(); // 判断是否为空
  q.size();  // 获取元素个数
  q.emplace(2); // 直接构造元素（效率更高）
  queue<int> copy_q(q); // 复制 queue
  queue<int> move_q(std::move(q)); // 移动 queue（q 变为空）
  queue<int> swap_q;
  swap(q, swap_q); // 交换两个 queue 的内容
  while (!q.empty()) { // 通过循环访问队头元素
  	cout << q.front() << " ";	q.pop();
  }
  queue<int> temp_q(q); // 复制一份 queue 用于遍历
  while (!temp_q.empty()) {
  	cout << temp_q.front() << " ";	temp_q.pop();
  }
  ```

- priority_queue（优先队列 / 堆），默认大顶堆（堆顶是最大值），算法题中常用来实现贪心 / 堆排序

  ```cpp
  // 大顶堆（默认）
  priority_queue<int> max_heap;
  max_heap.push(3);
  max_heap.push(1);
  max_heap.push(5);
  cout << max_heap.top(); // 输出5
  max_heap.pop(); // 弹出5
  max_heap.top(); // 输出3
  max_heap.empty(); // 判断是否为空
  max_heap.size(); // 获取元素个数
  max_heap.emplace(2); // 直接构造元素（效率更高）
  priority_queue<int> copy_heap(max_heap); // 复制 priority_queue
  priority_queue<int> move_heap(std::move(max_heap)); // 移动 priority_queue（max_heap 变为空）
  priority_queue<int> swap_heap;
  swap(max_heap, swap_heap); // 交换两个 priority_queue 的内容
  for (priority_queue<int> temp = max_heap; !temp.empty(); temp.pop()) { // 遍历 priority_queue（需要复制一份）
    cout << temp.top() << " ";
  }
  vector<int> vec = {4, 2, 7, 1};
  priority_queue<int> max_heap2(vec.begin(), vec.end()); // 直接用 vector 初始化大顶堆
  priority_queue<int, vector<int>, greater<int>> min_heap(vec.begin(), vec.end()); // 直接用 vector 初始化小顶堆

  // 小顶堆（自定义）
  priority_queue<int, vector<int>, greater<int>> min_heap;
  min_heap.push(3);
  min_heap.push(1);
  min_heap.push(5);
  cout << min_heap.top(); // 输出1
  ```

- unordered_map（哈希表），常用于统计元素频率（比 map 效率高，无排序）

  ```cpp
  unordered_map<int, int> freq;
  freq[1]++; // 统计1出现的次数
  freq[2] = 3;
  // 遍历哈希表
  for (auto& pair : freq) {
      cout << pair.first << ": " << pair.second << endl;
  }
  // 查找元素
  if (freq.count(1)) {
    cout << "1出现了" << freq[1] << "次" << endl;
  }
  // 删除元素
  freq.erase(1);
  // 清空哈希表
  freq.clear();
  // 复制 unordered_map
  unordered_map<int, int> copy_freq(freq);
  // 移动 unordered_map
  unordered_map<int, int> move_freq(std::move(freq)); // freq 变为空
  // 交换 unordered_map
  unordered_map<int, int> swap_freq;
  swap(freq, swap_freq); // 交换两个 unordered_map 的内容
  // 获取哈希表大小
  cout << "哈希表大小：" << freq.size() << endl;
  // 判断哈希表是否为空
  cout << "哈希表是否为空：" << freq.empty() << endl;
  // 获取哈希表中某个键的值（如果键不存在会自动创建并初始化为0）
  cout << "键2的值：" << freq[2] << endl;
  // 获取哈希表中某个键的值（如果键不存在不会创建，返回默认值0）
  cout << "键3的值：" << freq.at(3) << endl;
  // 从 vector 初始化 unordered_map（统计频率）
  vector<int> nums = {1,2,2,3,3,3};
  unordered_map<int, int> freq2;
  for (int x : nums) {
    freq2[x]++;
  }
  // 直接用 vector 初始化 unordered_map（不统计频率，只是把元素作为键，值默认0）
  unordered_map<int, int> freq3(nums.begin(), nums.end());
  // 查找元素是否存在
  if(freq2.find(2) != freq2.end()) {
    cout << "2存在，出现了" << freq2[2] << "次" << endl;
  }
  if(freq2.find(4) == freq2.end()) {
    cout << "4不存在" << endl;
  }
  ```

- unordered_set（哈希集合），常用于去重 / 查找存在性（比 set 效率高，无排序）

  ```cpp
  unordered_set<int> s;
  s.insert(1); // 插入元素
  s.erase(1); // 删除元素
  s.count(1); // 判断元素是否存在
  s.empty(); // 判断是否为空
  s.size(); // 获取元素个数
  for (int x : s) { // 遍历 unordered_set
    cout << x << " ";
  }
  unordered_set<int> copy_s(s); // 复制 unordered_set
  unordered_set<int> move_s(std::move(s)); // 移动 unordered_set（s 变为空）
  unordered_set<int> swap_s;
  swap(s, swap_s); // 交换两个 unordered_set 的内容
  // 查找元素是否存在
  if(s2.find(2) != s2.end()) {
    cout << "2存在" << endl;
  }
  if(s2.find(4) == s2.end()) {
    cout << "4不存在" << endl;
  }
  // 从 vector 初始化 unordered_set（去重）
  vector<int> nums = {1,2,2,3,3,3};
  unordered_set<int> s3(nums.begin(), nums.end());
  ```

- set（有序集合），常用于去重 / 查找存在性（比 unordered_set 效率低，有排序）

  ```cpp
  set<int> s;
  s.insert(1);      // 插入元素
  s.erase(1);       // 删除元素
  s.count(1);       // 判断元素是否存在
  s.empty();        // 判断是否为空
  s.size();         // 获取元素个数
  for (int x : s) { // 遍历 set（有序）
      cout << x << " ";
  }
  set<int> copy_s(s);            // 复制 set
  set<int> move_s(std::move(s)); // 移动 set（s
  set<int> swap_s;
  swap(s, swap_s); // 交换两个 set 的内容
  // 查找元素是否存在
  if (s2.find(2) != s2.end()) {
      cout << "2存在" << endl;
  }
  if (s2.find(4) == s2.end()) {
      cout << "4不存在" << endl;
  }
  // 从 vector 初始化 set（去重）
  vector<int> nums = {1, 2, 2, 3, 3, 3};
  set<int> s3(nums.begin(), nums.end());
  ```

- pair（键值对），常用于 map / unordered_map 的元素类型，也可单独使用

  ```cpp
  pair<int, string> p(1, "one"); // 创建一个 pair
  cout << p.first; // 访问第一个元素
  cout << p.second; // 访问第二个元素
  pair<int, string> copy_p(p); // 复制 pair
  pair<int, string> move_p(std::move(p)); // 移动 pair（p 变为空）
  pair<int, string> swap_p;
  swap(p, swap_p); // 交换两个 pair 的内容
  make_pair(2, "two"); // 创建一个 pair（类型自动推断）
  pair<int, string> p2 = make_pair(3, "three"); // 创建
  pair<int, string> p3 = {4, "four"}; // 列表初始化创建 pair
  vector<pair<int, string>> vec = {{1, "one"}, {2, "two"}}; // vector 中的 pair
  for (const auto& [num, word] : vec) { // C++17 结构化绑定遍历 vector 中的 pair
  cout << num << ": " << word << endl;
  }
  vec.emplace_back(3, "three"); // 直接构造一个 pair 插入 vector
  vec.emplace_back(make_pair(4, "four")); // 直接构造一个 pair 插入 vector（使用 make_pair）
  vec.emplace_back({5, "five"}); // 直接构造一个 pair 插入 vector（使用列表初始化）
  ```

- tuple（元组），可包含多个不同类型的元素，常用于函数返回多个值

  ```cpp
  tuple<int, string, double> t(1, "one", 3.14); // 创建一个 tuple
  cout << get<0>(t); // 访问第一个元素
  cout << get<1>(t); // 访问第二个元素
  cout << get<2>(t); // 访问第三个元素
  tuple<int, string, double> copy_t(t); // 复制 tuple
  tuple<int, string, double> move_t(std::move(t)); // 移动 tuple（t 变为空）
  tuple<int, string, double> swap_t;
  swap(t, swap_t); // 交换两个 tuple 的内容
  make_tuple(2, "two", 2.71); // 创建一个 tuple（类型自动推断）
  auto t2 = make_tuple(3, "three", 1.61); // 创建一个 tuple（类型自动推断）
  auto [num, word, pi] = t2; // C++17 结构化绑定解包 tuple
  ```

## 高级用法

- lambda 表达式：匿名函数，常用于算法中的自定义比较器 / 条件

  ```cpp
  vector<int> nums = {1,2,3,4,5};
  sort(nums.begin(), nums.end(), [](int a, int b) {
    return a > b; // 降序排序
  });
  int count_even = count_if(nums.begin(), nums.end(), [](int x) {
    return x % 2 == 0; // 统计偶数的个数
  });
  auto longest_it = max_element(words.begin(), words.end(), [](const string& a, const string& b) {
    return a.length() < b.length(); // 获取最长字符串
  });
  ```

- 函数内匿名函数：在函数内部定义一个匿名函数，常用于递归 / 回调

  ```cpp
  void recursive_function(int n) {
    if (n <= 0) return;
    cout << n << " ";
    auto next = [](int x) { return x - 1; }; // 定义一个匿名函数
    recursive_function(next(n)); // 递归调用匿名函数
  }
  // 捕获外部变量的匿名函数
  void capture_example() {
    int count = 0;
    auto addCount = [count](int x) { count += x; }; // 定义一个捕获外部变量的匿名函数（值捕获，count 的值被复制到匿名函数中）
    addCount(5); // 调用匿名函数，count 仍然是0，因为匿名函数内部的 count 是一个副本
    cout << "Count: " << count << endl; // 输出 Count: 0
    auto increment = [&count]() { count++; }; // 定义一个捕获外部变量的匿名函数
    increment(); // 调用匿名函数，count 变为1
    increment(); // 调用匿名函数，count 变为2
    cout << "Count: " << count << endl; // 输出 Count: 2
  }
  // 生命周期：捕获外部变量的匿名函数必须在被捕获变量的生命周期内使用，否则会导致未定义行为
  void invalid_capture() {
    auto invalid_func = [count]() { return count; }; // 定义一个捕获外部变量的匿名函数（值捕获）
    // count 变量在匿名函数定义时已经超出作用域，导致 invalid_func 捕获了一个无效的变量副本
    cout << "Invalid capture: " << invalid_func() << endl; // 行为未定义，可能输出垃圾值或崩溃
  }
  ```

- 函数对象（仿函数）：定义一个类，重载 operator()，使其成为一个可调用对象

  ```cpp
  struct Add {
    int operator()(int a, int b) const {
  	  return a + b; // 定义一个函数对象，实现加法
    }
  };
  Add add; // 创建一个函数对象实例
  int result = add(3, 4); // 调用函数对象，结果为7
  // 函数对象也可以有成员变量
  struct Counter {
    int count = 0;
    void operator()() {
  	  count++; // 每次调用函数对象时，count 增加1
    }
  };
  Counter counter; // 创建一个函数对象实例
  counter(); // 调用函数对象，count 变为1
  counter(); // 调用函数对象，count 变为2
  cout << "Counter: " << counter.count << endl; // 输出 Counter: 2
  // 函数对象也可以有构造函数
  struct Multiplier {
    int factor;
    Multiplier(int f) : factor(f) {} // 构造函数，初始化 factor
    int operator()(int x) const {
  	  return x * factor; // 定义一个函数对象，实现乘法
    }
  };
  Multiplier times2(2); // 创建一个函数对象实例，factor 为2
  int result2 = times2(5); // 调用函数对象，结果为10
  // 局部类也可以作为函数对象使用
  void local_class_example() {
    class LocalAdder {
    public:
  	  int operator()(int a, int b) const {
  		  return a + b; // 定义一个局部类函数对象，实现加法
  	  }
    };
    LocalAdder adder; // 创建一个局部类函数对象实例
    int result = adder(3, 4); // 调用局部类函数对象，结果为7
  }
  ```

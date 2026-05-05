---
title: 栈与队列
description: 深入理解栈和队列的实现原理与应用场景
---

## 栈与队列基础知识

- 在 C++ 中，栈（stack）和队列（queue）不属于 STL 容器，而是被归类为容器适配器（container adapter）
- 容器适配器的核心特点：不直接实现数据存储，而是封装底层容器（如 deque/vector/list），通过限制底层容器的接口（比如只开放一端操作），来实现栈 “先进后出”、队列 “先进先出” 的特性
- SGI STL 中栈（stack）的底层实现
  - 默认底层容器：deque（双向队列），只需封住 deque 的一端、只开放另一端，即可实现栈的逻辑；
  - 可指定底层容器：支持 vector/list 等，例如指定 vector 为底层的初始化方式
- SGI STL 中队列（queue）的底层实现
  - 默认底层容器：同样是 deque（双向队列），通过限制 deque 的两端操作（一端入、一端出）实现队列逻辑；
  - 可指定底层容器：支持 list 等，例如指定 list 为底层的初始化方式

### 用栈实现队列

- 队列的核心是 “先进先出”，而栈是 “先进后出”，可以用两个栈（记为 `inStack` 和 `outStack`）来实现：

- 入队操作：直接将元素压入 `inStack`；

- 出队操作：
  - 如果 `outStack` 为空，先把 `inStack` 中的所有元素依次弹出并压入 `outStack`（此时 `outStack` 中元素的顺序就和原队列一致了）；
  - 再从 `outStack` 弹出栈顶元素，即为队列的队首元素；

- 获取队首元素：逻辑和出队类似，先确保 `outStack` 有元素，再返回其栈顶；

- 判空 / 获取大小：两个栈的元素总数为队列大小，总数为 0 则为空

- 代码实现

  ```cpp
  #include <iostream>
  #include <stack>
  using namespace std;

  // 用两个栈实现队列
  class MyQueue {
  private:
      stack<int> inStack;   // 负责入队的栈
      stack<int> outStack;  // 负责出队的栈

      // 辅助函数：将inStack的元素转移到outStack（仅当outStack为空时调用）
      void transfer() {
          if (outStack.empty()) {
              while (!inStack.empty()) {
                  outStack.push(inStack.top());
                  inStack.pop();
              }
          }
      }

  public:
      MyQueue() {}

      // 入队：直接压入inStack
      void push(int x) {
          inStack.push(x);
      }

      // 出队：返回队首元素并移除
      int pop() {
          transfer(); // 确保outStack有元素
          int frontVal = outStack.top();
          outStack.pop();
          return frontVal;
      }

      // 获取队首元素（不移除）
      int peek() {
          transfer(); // 确保outStack有元素
          return outStack.top();
      }

      // 判断队列是否为空
      bool empty() {
          return inStack.empty() && outStack.empty();
      }

      // 获取队列大小（可选）
      int size() {
          return inStack.size() + outStack.size();
      }
  };
  ```

- 参考题目
  - [232. 用栈实现队列](https://leetcode.cn/problems/implement-queue-using-stacks/)

### 用队列实现栈

- 栈的核心是 “先进后出”，队列是 “先进先出”，可以用 一个或两个队列 实现，其中单队列方案更简洁，核心逻辑如下：

- 入栈操作：直接将元素加入队列；

- 出栈操作：
  - 把队列中除了最后一个元素外的所有元素，依次出队并重新入队到队列尾部；
  - 此时队列的队首元素就是栈顶元素，直接出队即可；

- 获取栈顶元素：可以复用出栈的逻辑（先重排，记录队首元素后再恢复），或直接记录最后入栈的元素；

- 判空 / 获取大小：直接复用队列的判空和大小接口

- 代码实现

  ```cpp
  #include <iostream>
  #include <queue>
  using namespace std;

  // 用单个队列实现栈
  class MyStack {
  private:
      queue<int> q; // 核心队列

  public:
      MyStack() {}

      // 入栈：直接入队
      void push(int x) {
          q.push(x);
      }

      // 出栈：返回栈顶元素并移除
      int pop() {
          // 步骤1：将队列前n-1个元素移到队列尾部
          int size = q.size();
          for (int i = 0; i < size - 1; ++i) {
              q.push(q.front()); // 队首元素重新入队
              q.pop();           // 移除原队首元素
          }
          // 步骤2：此时队首就是栈顶元素，直接出队
          int topVal = q.front();
          q.pop();
          return topVal;
      }

      // 获取栈顶元素（不移除）
      int top() {
          // 方法1：复用pop逻辑（稍显冗余但易理解）
          int topVal = this->pop(); // 先弹出栈顶
          this->push(topVal);       // 再重新入栈
          return topVal;

          // 方法2：直接返回队列最后一个元素（更高效，C++11+支持）
          // return q.back();
      }

      // 判断栈是否为空
      bool empty() {
          return q.empty();
      }

      // 获取栈的大小（可选）
      int size() {
          return q.size();
      }
  };
  ```

- 双队列实现：定义两个队列 `q1`（主队列，存储栈的所有元素）和 `q2`（辅助队列，临时中转），核心逻辑：
  - 入栈操作：直接将元素加入主队列 `q1`；
  - 出栈操作：
    - 把 `q1` 中除最后一个元素外的所有元素，依次出队并加入 `q2`；
    - 此时 `q1` 中仅剩的那个元素就是栈顶元素，直接出队（完成出栈）；
    - 交换 `q1` 和 `q2` 的身份（让 `q2` 变为新的主队列，`q1` 清空备用）；
  - 获取栈顶元素：逻辑和出栈类似，先把 `q1` 前 n-1 个元素移到 `q2`，记录 `q1` 仅剩的元素后，再把它移到 `q2`，最后交换队列身份；
  - 判空 / 大小：直接判断主队列 `q1` 是否为空、获取 `q1` 的大小即可

- 代码实现

  ```cpp
  #include <iostream>
  #include <queue>
  using namespace std;

  // 用两个队列实现栈
  class MyStack {
  private:
      queue<int> q1; // 主队列：存储栈的所有元素
      queue<int> q2; // 辅助队列：临时中转元素

  public:
      MyStack() {}

      // 入栈：直接加入主队列q1
      void push(int x) {
          q1.push(x);
      }

      // 出栈：返回栈顶元素并移除
      int pop() {
          // 步骤1：将q1中前n-1个元素转移到q2
          int size = q1.size();
          for (int i = 0; i < size - 1; ++i) {
              q2.push(q1.front());
              q1.pop();
          }

          // 步骤2：q1中仅剩的元素就是栈顶，取出并移除
          int topVal = q1.front();
          q1.pop();

          // 步骤3：交换q1和q2的身份（q2变为主队列，q1清空）
          swap(q1, q2);

          return topVal;
      }

      // 获取栈顶元素（不移除）
      int top() {
          // 步骤1：和pop逻辑一致，先转移前n-1个元素到q2
          int size = q1.size();
          for (int i = 0; i < size - 1; ++i) {
              q2.push(q1.front());
              q1.pop();
          }

          // 步骤2：记录栈顶元素
          int topVal = q1.front();

          // 步骤3：把栈顶元素也移到q2（区别于pop，不直接移除）
          q2.push(q1.front());
          q1.pop();

          // 步骤4：交换队列身份
          swap(q1, q2);

          return topVal;
      }

      // 判断栈是否为空
      bool empty() {
          return q1.empty();
      }

      // 获取栈的大小
      int size() {
          return q1.size();
      }
  };
  ```

- 参考题目
  - [225. 用队列实现栈](https://leetcode.cn/problems/implement-stack-using-queues/description/)

## 栈的应用

### 有效的括号

- 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效，有效字符串需满足：
  - 左括号必须用相同类型的右括号闭合
  - 左括号必须以正确的顺序闭合
  - 注意空字符串可被认为是有效字符串

- 示例代码

  ```cpp
  class Solution {
  public:
      bool isValid(string s) {
          if (s.size() % 2 != 0) return false; // 如果s的长度为奇数，一定不符合要求
          stack<char> st;
          for (int i = 0; i < s.size(); i++) {
              if (s[i] == '(') st.push(')');
              else if (s[i] == '{') st.push('}');
              else if (s[i] == '[') st.push(']');
              // 第三种情况：遍历字符串匹配的过程中，栈已经为空了，没有匹配的字符了，说明右括号没有找到对应的左括号 return false
              // 第二种情况：遍历字符串匹配的过程中，发现栈里没有我们要匹配的字符。所以return false
              else if (st.empty() || st.top() != s[i]) return false;
              else st.pop(); // st.top() 与 s[i]相等，栈弹出元素
          }
          // 第一种情况：此时我们已经遍历完了字符串，但是栈不为空，说明有相应的左括号没有右括号来匹配，所以return false，否则就return true
          return st.empty();
      }
  };
  ```

- 参考题目
  - [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/description/)
  - [22. 括号生成](https://leetcode.cn/problems/generate-parentheses/description/)
  - [1003. 检查替换后的词是否有效](https://leetcode.cn/problems/check-if-word-is-valid-after-substitutions/description/)
  - [2116. 判断一个括号字符串是否有效](https://leetcode.cn/problems/check-if-a-parentheses-string-can-be-valid/description/)
  - [2337. 移动片段得到字符串](https://leetcode.cn/problems/move-pieces-to-obtain-a-string/description/)
  - [777. 在 LR 字符串中交换相邻字符](https://leetcode.cn/problems/swap-adjacent-in-lr-string/description/)
  - [32. 最长有效括号](https://leetcode.cn/problems/longest-valid-parentheses/description/)
  - [1963. 使字符串平衡的最小交换次数](https://leetcode.cn/problems/minimum-number-of-swaps-to-make-the-string-balanced/description/)

### 删除相邻重复项

- 给出由小写字母组成的字符串 `s`，重复项删除操作会选择两个相邻且相同的字母，并删除它们；在 `s` 上反复执行重复项删除操作，直到无法继续删除；在完成所有重复项删除操作后返回最终的字符串

- 代码实现

  ```cpp
  class Solution {
  public:
      string removeDuplicates(string S) {
          stack<char> st;
          for (char s : S) {
              if (st.empty() || s != st.top()) {
                  st.push(s);
              } else {
                  st.pop(); // s 与 st.top()相等的情况
              }
          }
          string result = "";
          while (!st.empty()) { // 将栈中元素放到result字符串汇总
              result += st.top();
              st.pop();
          }
          reverse (result.begin(), result.end()); // 此时字符串需要反转一下
          return result;

      }
  };
  ```

- 参考题目
  - [1047. 删除字符串中的所有相邻重复项](https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string/description/)
  - [1209. 删除字符串中的所有相邻重复项 II](https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string-ii/description/)
  - [2390. 从字符串中移除星号](https://leetcode.cn/problems/removing-stars-from-a-string/description/)
  - [2716. 最小化字符串长度](https://leetcode.cn/problems/minimize-string-length/description/)

### 逆波兰表达式求值

- 根据 逆波兰表示法，求表达式的值

- 有效的运算符包括 + , - , \* , / 。每个运算对象可以是整数，也可以是另一个逆波兰表达式

- 代码实现

  ```cpp
  class Solution {
  public:
      int evalRPN(vector<string>& tokens) {
          // 力扣修改了后台测试数据，需要用longlong
          stack<long long> st;
          for (int i = 0; i < tokens.size(); i++) {
              if (tokens[i] == "+" || tokens[i] == "-" || tokens[i] == "*" || tokens[i] == "/") {
                  long long num1 = st.top();
                  st.pop();
                  long long num2 = st.top();
                  st.pop();
                  if (tokens[i] == "+") st.push(num2 + num1);
                  if (tokens[i] == "-") st.push(num2 - num1);
                  if (tokens[i] == "*") st.push(num2 * num1);
                  if (tokens[i] == "/") st.push(num2 / num1);
              } else {
                  st.push(stoll(tokens[i]));
              }
          }

          long long result = st.top();
          st.pop(); // 把栈里最后一个元素弹出（其实不弹出也没事）
          return result;
      }
  };
  ```

- 参考题目
  - [150. 逆波兰表达式求值](https://leetcode.cn/problems/evaluate-reverse-polish-notation/description/)
  - [224. 基本计算器](https://leetcode.cn/problems/basic-calculator/description/)
  - [227. 基本计算器 II](https://leetcode.cn/problems/basic-calculator-ii/description/)
  - [282. 给表达式添加运算符](https://leetcode.cn/problems/expression-add-operators/description/)
  - [241. 为运算表达式设计优先级](https://leetcode.cn/problems/different-ways-to-add-parentheses/description/)
  - [494. 目标和](https://leetcode.cn/problems/target-sum/description/)

### 模拟栈序列

- 给定 `pushed` 和 `popped` 两个序列，每个序列中的**值都不重复**，只有当它们可能是在最初空栈上进行的推入 push 和弹出 pop 操作序列的结果时，返回 `true`；否则，返回 `false`

- 代码实现

  ```cpp
  class Solution {
  public:
      bool validateStackSequences(vector<int>& pushed, vector<int>& popped) {
          if (pushed.empty())
              return true;
          stack<int> st;
          int i = 0, j = 0;
          while (true) {
              while ((st.empty() || st.top() != popped[j]) && i < pushed.size()) {
                  st.push(pushed[i]);
                  i++;
              }
              while (!st.empty() && j < popped.size() && st.top() == popped[j]) {
                  st.pop();
                  j++;
              }
              if (i == pushed.size() && j == popped.size())
                  return true;
              if (!st.empty() && st.top() != popped[j] && i == pushed.size())
                  return false;
          }
          return true;
      }
  };
  ```

- 简化实现

  ```cpp
  class Solution {
  public:
      bool validateStackSequences(vector<int>& pushed, vector<int>& popped) {
          stack<int> st;
          int j = 0; // 指向popped的指针
          // 遍历所有入栈元素，核心逻辑只需要这一层循环
          for (int num : pushed) {
              st.push(num); // 当前元素入栈
              // 只要栈顶和popped[j]匹配，就出栈并移动popped指针
              while (!st.empty() && st.top() == popped[j]) {
                  st.pop();
                  j++;
              }
          }
          // 最终如果栈为空，说明所有元素都按规则出栈，序列合法
          return st.empty();
      }
  };
  ```

- 也可以原地实现

  ```cpp
  #include <vector>
  using namespace std;

  class Solution {
  public:
      bool validateStackSequences(vector<int>& pushed, vector<int>& popped) {
          int top = -1; // 模拟栈的栈顶指针（初始为空）
          int j = 0;    // popped数组的遍历指针

          for (int num : pushed) {
              // 压栈：将当前元素放到模拟栈的栈顶位置（top先+1，再赋值）
              pushed[++top] = num;

              // 弹栈：栈非空 且 栈顶等于待弹出元素，就弹出（top--）
              while (top >= 0 && pushed[top] == popped[j]) {
                  top--;
                  j++;
              }
          }

          // 栈空说明所有元素都按规则弹出，序列合法
          return top == -1;
      }
  };
  ```

### 简化路径

- 题目：[71. 简化路径](https://leetcode.cn/problems/simplify-path/description/)

- 代码实现

  ```cpp
  class Solution {
  public:
      string simplifyPath(string s) {
          stack<string> st;
          for (int i = 0; i < s.size(); i++) {
              if (s[i] == '/') {
                  continue;
              } else if ((s[i] >= 'a' && s[i] <= 'z') ||
                         (s[i] >= 'A' && s[i] <= 'Z')) {
                  string dir;
                  while (i < s.size() && s[i] != '/') {
                      dir += s[i++];
                  }
                  i--;
                  st.push(dir);
              } else if (s[i] == '.') {
                  string dir;
                  while (i < s.size() && s[i] == '.')
                      dir += s[i++];
                  if ((i == s.size() || s[i] == '/') && dir.size() <= 2) {
                      if (dir == ".")
                          continue;
                      else if (dir == ".." && !st.empty())
                          st.pop();
                  } else {
                      while (i < s.size() && s[i] != '/') {
                          dir += s[i++];
                      }
                      i--;
                      st.push(dir);
                  }
              }
          }
          string res = "";
          vector<string> paths;
          while (!st.empty()) {
              paths.push_back(st.top());
              st.pop();
          }
          for (int i = paths.size() - 1; i >= 0; i--) {
              res += "/";
              res += paths[i];
          }
          return res == "" ? "/" : res;
      }
  };
  ```

- 优化逻辑

  ```cpp
  class Solution {
  public:
      string simplifyPath(string s) {
          stack<string> st;
          int n = s.size();
          int i = 0;

          // 纯手动遍历每个字符，提取路径片段
          while (i < n) {
              // 跳过所有连续的 '/'
              while (i < n && s[i] == '/') {
                  i++;
              }

              // 提取当前路径片段（从非 '/' 开始，到 '/' 结束）
              string segment;
              while (i < n && s[i] != '/') {
                  segment += s[i];
                  i++;
              }

              // 根据片段类型处理
              if (segment == ".") {
                  // 当前目录，跳过
                  continue;
              } else if (segment == "..") {
                  // 上级目录，栈非空则弹出
                  if (!st.empty()) {
                      st.pop();
                  }
              } else if (!segment.empty()) {
                  // 有效目录名（非空、非.、非..），入栈
                  st.push(segment);
              }
          }

          // 拼接最终路径
          string res;
          while (!st.empty()) {
              res = "/" + st.top() + res;
              st.pop();
          }

          // 空路径返回 "/"
          return res.empty() ? "/" : res;
      }
  };
  ```

### 用数组实现栈

- 实现思路
  - 用数组存储元素，维护一个 “栈顶指针”（索引），初始为 - 1（空栈）
  - 入栈（push）：栈顶指针 + 1，将元素放入该索引位置
  - 出栈（pop）：返回栈顶指针位置的元素，栈顶指针 - 1（无需真正删除，覆盖即可）
  - 查看栈顶（top）：直接返回栈顶指针位置的元素

- 代码实现

  ```cpp
  #include <iostream>
  #include <stdexcept>

  // 用静态数组实现栈（固定大小）
  template <typename T, size_t MAX_SIZE = 100>
  class ArrayStack {
  private:
      T data[MAX_SIZE];  // 存储元素的数组
      int topIndex;      // 栈顶指针（-1表示空栈）

  public:
      ArrayStack() : topIndex(-1) {}

      // 入栈
      void push(const T& value) {
          if (full()) {
              throw std::overflow_error("Stack is full, cannot push");
          }
          data[++topIndex] = value;  // 栈顶指针+1，存入元素
      }

      // 出栈
      T pop() {
          if (empty()) {
              throw std::underflow_error("Stack is empty, cannot pop");
          }
          return data[topIndex--];  // 返回栈顶元素，栈顶指针-1
      }

      // 查看栈顶
      T top() const {
          if (empty()) {
              throw std::underflow_error("Stack is empty, cannot get top");
          }
          return data[topIndex];
      }

      // 判断空/满
      bool empty() const { return topIndex == -1; }
      bool full() const { return topIndex == MAX_SIZE - 1; }
      size_t size() const { return topIndex + 1; }
  };
  ```

### 用链表实现栈

- 实现思路：
  - 用单链表存储元素，链表头作为栈顶（无需遍历到链表尾）
  - 入栈（push）：新节点作为链表头（头插）
  - 出栈（pop）：删除并返回链表头节点（头删）
  - 查看栈顶（top）：返回链表头节点的值

- 代码实现

  ```cpp
  #include <iostream>
  #include <stdexcept>

  // 单链表节点
  template <typename T>
  struct ListNode {
      T val;
      ListNode* next;
      ListNode(const T& v) : val(v), next(nullptr) {}
  };

  // 用单链表实现栈
  template <typename T>
  class LinkedStack {
  private:
      ListNode<T>* head;  // 链表头=栈顶
      size_t count;       // 元素个数

  public:
      LinkedStack() : head(nullptr), count(0) {}

      // 析构函数：释放内存
      ~LinkedStack() {
          while (head) {
              ListNode<T>* temp = head;
              head = head->next;
              delete temp;
          }
      }

      // 入栈（头插）
      void push(const T& value) {
          ListNode<T>* newNode = new ListNode<T>(value);
          newNode->next = head;  // 新节点指向原栈顶
          head = newNode;        // 新节点成为新栈顶
          count++;
      }

      // 出栈（头删）
      T pop() {
          if (empty()) {
              throw std::underflow_error("Stack is empty, cannot pop");
          }
          ListNode<T>* temp = head;
          T val = temp->val;
          head = head->next;  // 栈顶后移
          delete temp;        // 释放原栈顶内存
          count--;
          return val;
      }

      // 查看栈顶
      T top() const {
          if (empty()) {
              throw std::underflow_error("Stack is empty, cannot get top");
          }
          return head->val;
      }

      bool empty() const { return head == nullptr; }
      size_t size() const { return count; }
  };
  ```

### 用两个栈实现队列

- 使用两个栈分工协作：
  1.  输入栈（inStack）：专门处理入队操作（`push`），新元素直接压入这个栈
  2.  输出栈（outStack）：专门处理出队（`pop`）和查看队首（`peek`）操作
  3.  关键逻辑：当需要出队 / 查看队首时，如果输出栈为空，就把输入栈的所有元素依次弹出并压入输出栈 —— 这样输入栈的底部元素（最早入队的）会出现在输出栈顶部，完美契合队列 “先进先出” 的特性

- 代码实现

  ```cpp
  #include <iostream>
  #include <stack>
  #include <stdexcept>  // 用于异常处理

  // 用两个栈实现队列
  template <typename T>
  class QueueByStack {
  private:
      std::stack<T> inStack;   // 输入栈：处理入队
      std::stack<T> outStack;  // 输出栈：处理出队/查看队首

      // 辅助函数：将输入栈元素转移到输出栈（仅当输出栈为空时调用）
      void transfer() {
          if (outStack.empty()) {
              while (!inStack.empty()) {
                  outStack.push(inStack.top());
                  inStack.pop();
              }
          }
      }

  public:
      // 入队：将元素添加到队列尾部
      void push(const T& value) {
          inStack.push(value);
      }

      // 出队：删除并返回队列头部元素
      T pop() {
          if (empty()) {
              throw std::underflow_error("Queue is empty, cannot pop");
          }
          // 确保输出栈有元素
          transfer();
          T frontValue = outStack.top();
          outStack.pop();
          return frontValue;
      }

      // 查看队首元素（不删除）
      T peek() const {
          if (empty()) {
              throw std::underflow_error("Queue is empty, cannot peek");
          }
          // const成员函数需创建临时栈完成转移，避免修改原数据
          std::stack<T> tempIn = inStack;
          std::stack<T> tempOut = outStack;

          if (tempOut.empty()) {
              while (!tempIn.empty()) {
                  tempOut.push(tempIn.top());
                  tempIn.pop();
              }
          }
          return tempOut.top();
      }

      // 判断队列是否为空
      bool empty() const {
          return inStack.empty() && outStack.empty();
      }

      // 获取队列元素个数
      size_t size() const {
          return inStack.size() + outStack.size();
      }
  };
  ```

### 用一个栈实现队列

- 双栈实现队列的核心是 “输入栈存元素，输出栈做反转”，而单栈实现的关键是：
  1.  利用递归（或迭代）的 “回溯” 特性模拟第二个栈的行为：递归调用时，栈的元素会被逐层弹出暂存到调用栈（内存）中，相当于临时的 “输出栈”
  2.  入队（push）：直接压入栈（和双栈一致，O(1)）
  3.  出队（pop）/ 查看队首（peek）：通过递归弹出栈内所有元素，找到最底层的元素（队列头部），再把其余元素重新压回栈中 —— 这个过程相当于双栈的 “转移” 操作，只是用递归替代了第二个物理栈

- 代码实现

  ```cpp
  #include <iostream>
  #include <stack>
  #include <stdexcept>  // 异常处理

  // 仅用一个栈实现队列
  template <typename T>
  class QueueBySingleStack {
  private:
      std::stack<T> s;  // 唯一的栈

      // 递归辅助函数：获取并移除栈底元素（队列头部）
      T getAndRemoveBottom() {
          T topVal = s.top();
          s.pop();
          // 递归终止条件：栈只剩一个元素（栈底=队列头部）
          if (s.empty()) {
              return topVal;
          }
          // 递归获取栈底元素
          T bottomVal = getAndRemoveBottom();
          // 回溯：将弹出的非栈底元素重新压回栈
          s.push(topVal);
          return bottomVal;
      }

      // 递归辅助函数：仅查看栈底元素（不删除）
      T peekBottom() const {
          // const成员函数需拷贝栈，避免修改原数据
          std::stack<T> temp = s;
          // 迭代找到栈底元素（替代递归，避免const限制）
          while (temp.size() > 1) {
              temp.pop();
          }
          return temp.top();
      }

  public:
      // 入队：直接压入栈（O(1)）
      void push(const T& value) {
          s.push(value);
      }

      // 出队：删除并返回队列头部（栈底）
      T pop() {
          if (empty()) {
              throw std::underflow_error("Queue is empty, cannot pop");
          }
          return getAndRemoveBottom();
      }

      // 查看队首：仅返回队列头部（不删除）
      T peek() const {
          if (empty()) {
              throw std::underflow_error("Queue is empty, cannot peek");
          }
          return peekBottom();
      }

      // 判断队列是否为空
      bool empty() const {
          return s.empty();
      }

      // 获取队列元素个数
      size_t size() const {
          return s.size();
      }
  };
  ```

- 单栈 vs 双栈实现对比

  | 实现方式 | 空间复杂度         | 核心逻辑                    | 入队时间复杂度 | 出队时间复杂度 | 优势               | 劣势                     |
  | :------- | :----------------- | :-------------------------- | :------------- | :------------- | :----------------- | :----------------------- |
  | 单栈     | O(n)（递归调用栈） | 递归 / 迭代模拟栈底元素获取 | O(1)           | O(n)           | 仅用一个物理栈     | 效率低、递归有栈溢出风险 |
  | 双栈     | O(n)（两个物理栈） | 输入栈存元素，输出栈做转移  | O(1)           | O(1)（均摊）   | 效率高、无递归风险 | 占用额外物理栈空间       |

- 单栈实现的 `pop()` 时间复杂度是严格 O(n)（每次出队都要遍历所有元素），而双栈实现是均摊 O(1)（每个元素仅转移一次），因此单栈实现仅用于理解思路，实际开发中优先选择双栈实现

## 队列的应用

### 最近的请求次数

- 用数组 + 二分查找改造的核心逻辑：
  1.  数组存储：用动态数组（`vector`）按顺序存储所有 `ping` 传入的时间戳（天然递增，因为 `t` 是按调用顺序传入的，且时间递增）
  2.  二分查找：利用时间戳递增的特性，用二分查找快速找到**第一个 ≥ t-3000**的位置，这个位置之后的所有元素都是符合条件的，数量 = 数组长度 - 该位置索引

- 可以用数组+二分查找实现

  ```cpp
  class RecentCounter {
  private:
      std::vector<int> times;  // 存储所有ping的时间戳（递增顺序）

  public:
      RecentCounter() {}

      int ping(int t) {
          // 1. 将当前时间戳加入数组（保持递增）
          times.push_back(t);

          // 2. 计算时间边界：t - 3000
          int boundary = t - 3000;

          // 3. 二分查找第一个 ≥ boundary 的元素的索引
          // lower_bound返回迭代器，减去begin()得到索引
          int idx = std::lower_bound(times.begin(), times.end(), boundary) - times.begin();

          // 4. 符合条件的数量 = 数组总长度 - 起始索引
          return times.size() - idx;
      }
  };
  ```

### 按递增顺序显示卡牌

- 题目：[950. 按递增顺序显示卡牌](https://leetcode.cn/problems/reveal-cards-in-increasing-order/description/)

- 代码实现

  ```cpp
  class Solution {
  public:
      vector<int> shuffle(vector<int>& deck, int l, int r) {
          std::cout << "shuffle: " << l << " " << r << std::endl;
          if (l == r)
              return {deck[l]};
          int mid = l + (r - l) / 2;
          vector<int> res;
          vector<int> right = shuffle(deck, mid + 1, r);
          if ((r - l) % 2 == 0) {
              right.insert(right.begin(), right.back());
              right.resize(right.size() - 1);
          }
          for (int i = l, j = 0; i <= mid; i++, j++) {
              res.push_back(deck[i]);
              if (j < right.size()) {
                  res.push_back(right[j]);
              }
          }
          return res;
      }
      vector<int> deckRevealedIncreasing(vector<int>& deck) {
          sort(deck.begin(), deck.end());
          return shuffle(deck, 0, deck.size() - 1);
      }
  };
  ```

- 也可以用队列模拟
  - 先将卡牌升序排序（确定显示顺序）
  - 从最后一张显示的卡牌开始，反向模拟操作（把结果容器的最后一个元素移到开头 → 插入当前卡牌到开头）
  - 最终得到的容器就是满足条件的初始牌组

- 代码实现

  ```cpp
  // 计算能按递增顺序显示卡牌的初始牌组排列
  std::vector<int> deckRevealedIncreasing(std::vector<int>& deck) {
      // 1. 将卡牌按升序排序（确定最终显示顺序）
      std::sort(deck.begin(), deck.end());

      // 2. 使用双端队列反向构建初始牌组（高效支持头尾操作）
      std::deque<int> result_deque;

      // 从最后一张显示的牌开始反向遍历
      for (auto it = deck.rbegin(); it != deck.rend(); ++it) {
          int card = *it;
          // 反向操作1：如果队列非空，把最后一个元素移到开头
          if (!result_deque.empty()) {
              int last = result_deque.back();
              result_deque.pop_back();
              result_deque.push_front(last);
          }
          // 反向操作2：将当前卡牌插入到队列开头
          result_deque.push_front(card);
      }

      // 3. 将双端队列转换为vector返回
      return std::vector<int>(result_deque.begin(), result_deque.end());
  }

  // 辅助函数：模拟卡牌显示过程，验证结果是否正确
  void simulateReveal(const std::vector<int>& deck) {
      std::deque<int> temp(deck.begin(), deck.end());
      std::vector<int> revealed;

      while (!temp.empty()) {
          // 抽顶牌显示并移除
          revealed.push_back(temp.front());
          temp.pop_front();

          // 如果还有牌，将新顶牌移到底部
          if (!temp.empty()) {
              int top = temp.front();
              temp.pop_front();
              temp.push_back(top);
          }
      }

      // 输出验证结果
      std::cout << "模拟显示顺序: ";
      for (int num : revealed) {
          std::cout << num << " ";
      }
      std::cout << std::endl;
  }
  ```

### Dota2 参议院

- 题目：[649. Dota2 参议院](https://leetcode.cn/problems/dota2-senate/description/)

- 每次遇到一位 Radiant 玩家，就可以把一位不同阵营玩家 ban 掉，直到一方玩家被 ban 完后结束循环

  ```cpp
  class Solution {
  public:
      string predictPartyVictory(string senate) {
          queue<pair<char, bool>> que;
          int rTotal = 0, dTotal = 0;
          for (char ch : senate) {
              que.push(make_pair(ch, false));
              if (ch == 'R')
                  rTotal++;
              else
                  dTotal++;
          }
          int rCnt = 0, dCnt = 0;
          while (rTotal > 0 && dTotal > 0) {
              auto p = que.front();
              que.pop();
              if (p.first == 'R' && dCnt > 0) {
                  p.second = true;
                  dCnt--;
                  rTotal--;
              } else if (p.first == 'D' && rCnt > 0) {
                  p.second = true;
                  rCnt--;
                  dTotal--;
              }
              if (!p.second && !que.empty()) {
                  if (p.first == 'R') {
                      rCnt++;
                  } else {
                      dCnt++;
                  }
              }
              if (p.second != true) {
                  que.push(p);
              }
          }
          return rTotal > 0 ? "Radiant" : "Dire";
      }
  };
  ```

- 实际上可以使用两个队列来实现

  ```cpp
  class Solution {
  public:
      string predictPartyVictory(string senate) {
          int n = senate.size();
          queue<int> radiant, dire;
          for (int i = 0; i < n; ++i) {
              if (senate[i] == 'R') {
                  radiant.push(i);
              }
              else {
                  dire.push(i);
              }
          }
          while (!radiant.empty() && !dire.empty()) {
              if (radiant.front() < dire.front()) {
                  radiant.push(radiant.front() + n);
              }
              else {
                  dire.push(dire.front() + n);
              }
              radiant.pop();
              dire.pop();
          }
          return !radiant.empty() ? "Radiant" : "Dire";
      }
  };
  ```

### 设计前中后队列

- 题目：[1670. 设计前中后队列](https://leetcode.cn/problems/design-front-middle-back-queue/description/)

- 可以使用两个双端队列实现，并且满足左边的队列大小不能大于右侧队列，右侧队列的大小不能超过左侧队列的大小+1，这样可以使得在插入和弹出中间操作时，能够直接进行操作

- 可以定义一个 balance 函数来保证左右两侧的大小满足规则

- 代码实现

  ```cpp
  class FrontMiddleBackQueue {
  private:
      deque<int> left;
      deque<int> right;

      // 调整长度，保证 0 <= right.size() - left.size() <= 1
      // 从而保证可以在正中间插入删除元素
      void balance() {
          if (left.size() > right.size()) {
              right.push_front(left.back());
              left.pop_back();
          } else if (right.size() > left.size() + 1) {
              left.push_back(right.front());
              right.pop_front();
          }
      }

  public:
      void pushFront(int val) {
          left.push_front(val);
          balance();
      }

      void pushMiddle(int val) {
          if (left.size() < right.size()) {
              left.push_back(val);
          } else {
              right.push_front(val);
          }
      }

      void pushBack(int val) {
          right.push_back(val);
          balance();
      }

      int popFront() {
          if (right.empty()) { // 整个队列为空
              return -1;
          }
          int val;
          if (left.empty()) {
              val = right.front();
              right.pop_front();
          } else {
              val = left.front();
              left.pop_front();
          }
          balance();
          return val;
      }

      int popMiddle() {
          if (right.empty()) { // 整个队列为空
              return -1;
          }
          int val;
          if (left.size() == right.size()) {
              val = left.back();
              left.pop_back();
          } else {
              val = right.front();
              right.pop_front();
          }
          return val;
      }

      int popBack() {
          if (right.empty()) { // 整个队列为空
              return -1;
          }
          int val = right.back();
          right.pop_back();
          balance();
          return val;
      }
  };
  ```

### 设计路由器

- 题目：[3508. 设计路由器](https://leetcode.cn/problems/implement-router/description/)

- 有两个关键点
  - addPacket：需要在常数时间复杂度内，查询某个数据包是否已经存在——可以使用哈希表为每个数据包生成一个唯一的 key；同时如果队列已满，则需要 forwardPacket 最旧的数据包
  - getCount：需要快速查询同一个 destination 的指定时间段的数量，可以为每个 destination 维护一个有序列表，可以使用二分查找快速查找上下限
  - forwardPacket：从队首移除最旧的数据包，并从哈希表、destination 表在删除

- 代码实现

  ```cpp
  #include <vector>
  #include <unordered_set>
  #include <string>
  #include <algorithm>
  using namespace std;

  struct Packet {
      int source;
      int destination;
      int timestamp;
  };

  class Router {
  public:
      vector<Packet> que;          // 环形队列存储数据包
      vector<int> timestamps;      // 存储队列中数据包的timestamp，用于二分查找优化
      unordered_set<string> packetSet; // 存储数据包唯一标识，快速判重
      int front = 0;
      int back = 0;
      int capacity = 0;            // 最大存储数据包数量

      // 构造函数：初始化路由器内存限制
      Router(int memoryLimit) {
          capacity = memoryLimit;
          que = vector<Packet>(memoryLimit + 1, Packet()); // 环形队列预留1个空位
          timestamps = vector<int>(memoryLimit + 1, 0);    // 同步存储timestamp
      }

      // 生成数据包的唯一标识字符串
      string getPacketKey(int source, int destination, int timestamp) {
          return to_string(source) + "_" + to_string(destination) + "_" + to_string(timestamp);
      }

      // 移除队首数据包（内部辅助函数）
      void removeFrontPacket() {
          if (front == back) return; // 队列为空
          // 从集合中删除队首数据包的标识
          Packet& p = que[front];
          string key = getPacketKey(p.source, p.destination, p.timestamp);
          packetSet.erase(key);
          // 更新front指针
          front = (front + 1) % (capacity + 1);
      }

      // 添加数据包：重复返回false，满则移除最旧包后添加，成功返回true
      bool addPacket(int source, int destination, int timestamp) {
          // 1. 检查是否重复
          string newKey = getPacketKey(source, destination, timestamp);
          if (packetSet.count(newKey)) {
              return false;
          }

          // 2. 队列满则移除最旧数据包（队首）
          if ((back + 1) % (capacity + 1) == front) {
              removeFrontPacket();
          }

          // 3. 添加新数据包到队列尾部
          que[back].source = source;
          que[back].destination = destination;
          que[back].timestamp = timestamp;
          timestamps[back] = timestamp; // 同步更新timestamp数组
          packetSet.insert(newKey);     // 加入判重集合

          // 4. 更新back指针
          back = (back + 1) % (capacity + 1);
          return true;
      }

      // 转发队首数据包：FIFO，空则返回空数组
      vector<int> forwardPacket() {
          vector<int> result;
          if (front == back) { // 队列为空
              return result;
          }

          // 获取队首数据包信息
          Packet& p = que[front];
          result.push_back(p.source);
          result.push_back(p.destination);
          result.push_back(p.timestamp);

          // 从判重集合中移除
          string key = getPacketKey(p.source, p.destination, p.timestamp);
          packetSet.erase(key);

          // 更新front指针
          front = (front + 1) % (capacity + 1);
          return result;
      }

      // 统计符合条件的数据包数量：利用timestamp非递减特性优化
      int getCount(int destination, int startTime, int endTime) {
          int count = 0;
          // 由于timestamp非递减，队列中有效数据的timestamp也是有序的
          // 先遍历有效数据，同时利用有序性提前终止（timestamp > endTime则无需继续）
          int i = front;
          while (i != back) {
              Packet& p = que[i];
              // 时间戳超过endTime，后续都更大，直接终止遍历（核心优化点）
              if (p.timestamp > endTime) {
                  break;
              }
              // 检查目的地址和时间范围
              if (p.destination == destination && p.timestamp >= startTime) {
                  count++;
              }
              i = (i + 1) % (capacity + 1);
          }
          return count;
      }
  };

  /**
   * 测试用例示例：
   * Router* router = new Router(2); // 最大存储2个数据包
   * router->addPacket(1, 2, 100); // true，队列：[(1,2,100)]
   * router->addPacket(1, 2, 100); // false（重复）
   * router->addPacket(3, 4, 200); // true，队列：[(1,2,100), (3,4,200)]
   * router->addPacket(5, 6, 300); // 队列满，移除(1,2,100)，添加(5,6,300)，返回true
   * router->forwardPacket();      // 返回[3,4,200]，队列剩余：[(5,6,300)]
   * router->getCount(6, 250, 350); // 返回1
   */
  ```

- 可以继续优化 getCount，每一个 destination 维护一个时间戳队列；同时可以使用 TupleHash 代替字符串来生成唯一的 key

  ```cpp
  #include <vector>
  #include <queue>
  #include <unordered_set>
  #include <unordered_map>
  #include <deque>
  #include <tuple>
  #include <algorithm> // 兼容非 C++20 环境的 lower_bound/upper_bound
  #include <functional> // hash 依赖

  using namespace std;

  // 为 tuple 提供哈希函数，支持作为 unordered_set 的键
  struct TupleHash {
      template<typename T>
      static void hash_combine(size_t& seed, const T& v) {
          // 经典的 hash 组合算法（参考 boost），避免哈希碰撞
          seed ^= hash<T>{}(v) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
      }

      template<typename Tuple, size_t Index = 0>
      static void hash_tuple(size_t& seed, const Tuple& t) {
          if constexpr (Index < tuple_size_v<Tuple>) {
              hash_combine(seed, get<Index>(t));
              hash_tuple<Tuple, Index + 1>(seed, t);
          }
      }

      template<typename... Ts>
      size_t operator()(const tuple<Ts...>& t) const {
          size_t seed = 0;
          hash_tuple(seed, t);
          return seed;
      }
  };

  class Router {
      int memory_limit;
      queue<tuple<int, int, int>> packet_q; // 存储数据包的 FIFO 队列
      unordered_set<tuple<int, int, int>, TupleHash> packet_set; // 判重集合
      unordered_map<int, deque<int>> dest_to_timestamps; // 目的地址 -> 时间戳列表（有序）

  public:
      Router(int memoryLimit) {
          memory_limit = memoryLimit;
      }

      bool addPacket(int source, int destination, int timestamp) {
          auto packet = make_tuple(source, destination, timestamp);
          // 1. 检查重复：已存在则返回 false
          auto [it, inserted] = packet_set.insert(packet);
          if (!inserted) {
              return false;
          }

          // 2. 队列满则转发最旧数据包（移除队首）
          if (packet_q.size() == memory_limit) {
              forwardPacket();
          }

          // 3. 新数据包入队，并更新时间戳索引
          packet_q.push(packet);
          dest_to_timestamps[destination].push_back(timestamp);
          return true;
      }

      vector<int> forwardPacket() {
          vector<int> result;
          if (packet_q.empty()) {
              return result;
          }

          // 1. 取出队首数据包
          auto packet = packet_q.front();
          packet_q.pop();
          auto [source, destination, timestamp] = packet;

          // 2. 从判重集合中移除
          packet_set.erase(packet);

          // 3. 从时间戳索引中移除对应的值（队首）
          auto& timestamps = dest_to_timestamps[destination];
          if (!timestamps.empty()) {
              timestamps.pop_front();
              // 如果该目的地址无时间戳，清理 map 避免空值
              if (timestamps.empty()) {
                  dest_to_timestamps.erase(destination);
              }
          }

          // 4. 返回数据包信息
          result = {source, destination, timestamp};
          return result;
      }

      int getCount(int destination, int startTime, int endTime) {
          // 1. 该目的地址无数据，直接返回 0
          if (!dest_to_timestamps.count(destination)) {
              return 0;
          }

          auto& timestamps = dest_to_timestamps[destination];
          // 2. 二分查找：找到 >= startTime 的第一个位置
          auto left = lower_bound(timestamps.begin(), timestamps.end(), startTime);
          // 3. 二分查找：找到 > endTime 的第一个位置
          auto right = upper_bound(timestamps.begin(), timestamps.end(), endTime);

          // 4. 计算区间内的数量（迭代器相减）
          return right - left;
      }
  };

  /**
   * 测试用例验证（匹配你之前的输入）：
   * 输入流程：
   * 1. Router router(3); // 内存限制 3
   * 2. router.addPacket(1,4,90) → true
   * 3. router.addPacket(2,5,90) → true
   * 4. router.addPacket(1,4,90) → false（重复）
   * 5. router.addPacket(3,5,95) → true（队列：[(1,4,90),(2,5,90),(3,5,95)]）
   * 6. router.addPacket(4,5,105) → 队列满，调用 forwardPacket 移除 (1,4,90)，添加后队列：[(2,5,90),(3,5,95),(4,5,105)] → true
   * 7. router.forwardPacket() → 移除 (2,5,90)，返回 [2,5,90]（符合预期）
   * 8. router.addPacket(5,2,110) → true（队列：[(3,5,95),(4,5,105),(5,2,110)]）
   * 9. router.getCount(5,100,110) → 时间戳 100-110 内的只有 105 → 返回 1（符合预期）
   */
  ```

### 设计循环队列

- 题目：[622. 设计循环队列](https://leetcode.cn/problems/design-circular-queue/)

- 不用 `size` 变量时，通常采用数组预留一个空位的设计：
  - 队空条件：`front == rear`
  - 队满条件：`(rear + 1) % capacity == front`
  - 队列实际容量：`capacity - 1`（因为预留了 1 个空位）
  - 计算元素个数：`(rear - front + capacity) % capacity`

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <stdexcept>
  using namespace std;

  class CircularQueue {
  private:
      vector<int> arr;    // 数组元素
      int front;          // 队头指针，指向队头元素
      int rear;           // 队尾指针，指向队尾元素的下一个空位
      int capacity;       // 数组总容量（包含预留空位）

  public:
      // 构造函数：初始化队列，参数为用户期望的最大元素数
      CircularQueue(int maxSize) {
          this->capacity = maxSize + 1; // 预留1个空位
          this->arr.resize(this->capacity); // 初始化vector大小
          this->front = 0;
          this->rear = 0;
      }

      // 入队：从队尾添加元素
      bool enqueue(int value) {
          if (isFull()) {
              return false;
          }
          arr[rear] = value;
          rear = (rear + 1) % capacity; // 循环后移
          return true;
      }

      // 出队：从队头移除元素
      bool dequeue() {
          if (isEmpty()) {
              return false;
          }
          front = (front + 1) % capacity; // 循环后移
          return true;
      }

      // 获取队头元素
      int getFront() {
          if (isEmpty()) {
              throw runtime_error("CircularQueue is empty");
          }
          return arr[front];
      }

      // 获取队尾元素
      int getRear() {
          if (isEmpty()) {
              throw runtime_error("CircularQueue is empty");
          }
          // 队尾指针指向空位，实际队尾是 (rear-1 + capacity) % capacity
          return arr[(rear - 1 + capacity) % capacity];
      }

      // 判断队列是否为空
      bool isEmpty() const {
          return front == rear;
      }

      // 判断队列是否已满
      bool isFull() const {
          return (rear + 1) % capacity == front;
      }

      // 计算当前元素个数（替代size变量）
      int getSize() const {
          return (rear - front + capacity) % capacity;
      }
  };
  ```

### 设计循环双端队列

- 题目：[641. 设计循环双端队列](https://leetcode.cn/problems/design-circular-deque/description/)

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <stdexcept>
  using namespace std;

  class CircularDeque {
  private:
      vector<int> arr;    // 数组元素
      int front;          // 队头指针，指向队头元素
      int rear;           // 队尾指针，指向队尾元素的下一个空位
      int capacity;       // 数组总容量（包含预留空位）

  public:
      // 构造函数：参数为用户期望的最大元素数
      CircularDeque(int maxSize) {
          this->capacity = maxSize + 1; // 预留1个空位
          this->arr.resize(this->capacity); // 初始化vector大小
          this->front = 0;
          this->rear = 0;
      }

      // 队头入队
      bool addFirst(int value) {
          if (isFull()) {
              return false;
          }
          // front先向前移动（循环），再放入元素（加capacity避免负数）
          front = (front - 1 + capacity) % capacity;
          arr[front] = value;
          return true;
      }

      // 队尾入队
      bool addLast(int value) {
          if (isFull()) {
              return false;
          }
          arr[rear] = value;
          rear = (rear + 1) % capacity;
          return true;
      }

      // 队头出队
      bool removeFirst() {
          if (isEmpty()) {
              return false;
          }
          front = (front + 1) % capacity;
          return true;
      }

      // 队尾出队
      bool removeLast() {
          if (isEmpty()) {
              return false;
          }
          // rear向后移动（循环）
          rear = (rear - 1 + capacity) % capacity;
          return true;
      }

      // 获取队头元素
      int getFront() {
          if (isEmpty()) {
              throw runtime_error("CircularDeque is empty");
          }
          return arr[front];
      }

      // 获取队尾元素
      int getRear() {
          if (isEmpty()) {
              throw runtime_error("CircularDeque is empty");
          }
          return arr[(rear - 1 + capacity) % capacity];
      }

      // 判断空/满
      bool isEmpty() const {
          return front == rear;
      }

      bool isFull() const {
          return (rear + 1) % capacity == front;
      }

      // 计算元素个数（替代size）
      int getSize() const {
          return (rear - front + capacity) % capacity;
      }
  };
  ```

### 用数组实现队列

- 数组实现队列的核心是解决 “假溢出” 问题 （即数组尾部满了但头部还有空闲空间），因此采用循环数组（环形缓冲区） 设计：
  1. 维护两个指针（索引）：
     - `front`：指向队列头部（待出队的元素）
     - `rear`：指向队列尾部的下一个位置（待入队的位置）

  2. 核心规则：
     - 入队（enqueue）：将元素放入 `rear` 位置，`rear` 循环后移（`rear = (rear + 1) % capacity`）
     - 出队（dequeue）：取出 `front` 位置的元素，`front` 循环后移（`front = (front + 1) % capacity`）

  3. 判空 / 判满：
     - 空队列：`front == rear`
     - 满队列：`(rear + 1) % capacity == front`（预留一个空位，避免和空队列条件混淆）

- 代码实现

  ```cpp
  #include <iostream>
  #include <stdexcept>  // 异常处理
  #include <vector>     // 可选：用vector实现动态数组

  // 用静态数组实现循环队列（固定容量）
  template <typename T, size_t DEFAULT_CAPACITY = 10>
  class ArrayQueue {
  private:
      T data[DEFAULT_CAPACITY];  // 存储元素的数组
      size_t front;              // 队首指针（指向队首元素）
      size_t rear;               // 队尾指针（指向队尾下一个位置）
      size_t capacity;           // 队列容量（预留1位，实际可用DEFAULT_CAPACITY-1）

  public:
      // 构造函数
      ArrayQueue() : front(0), rear(0), capacity(DEFAULT_CAPACITY) {}

      // 判断队列是否为空
      bool isEmpty() const {
          return front == rear;
      }

      // 判断队列是否已满
      bool isFull() const {
          return (rear + 1) % capacity == front;
      }

      // 入队：添加元素到队尾
      void enqueue(const T& value) {
          if (isFull()) {
              throw std::overflow_error("Queue is full, cannot enqueue");
          }
          data[rear] = value;                // 元素放入rear位置
          rear = (rear + 1) % capacity;      // rear循环后移
      }

      // 出队：删除并返回队首元素
      T dequeue() {
          if (isEmpty()) {
              throw std::underflow_error("Queue is empty, cannot dequeue");
          }
          T frontValue = data[front];        // 取出队首元素
          front = (front + 1) % capacity;    // front循环后移
          return frontValue;
      }

      // 查看队首元素（不删除）
      T peek() const {
          if (isEmpty()) {
              throw std::underflow_error("Queue is empty, cannot peek");
          }
          return data[front];
      }

      // 获取队列有效元素个数
      size_t size() const {
          return (rear - front + capacity) % capacity;
      }

      // 打印队列元素（辅助测试）
      void print() const {
          if (isEmpty()) {
              std::cout << "Queue is empty" << std::endl;
              return;
          }
          std::cout << "Queue elements: ";
          size_t idx = front;
          while (idx != rear) {
              std::cout << data[idx] << " ";
              idx = (idx + 1) % capacity;
          }
          std::cout << std::endl;
      }
  };

  // 拓展：动态数组队列（自动扩容，无固定容量限制）
  template <typename T>
  class DynamicArrayQueue {
  private:
      std::vector<T> data;  // 动态数组
      size_t front;         // 队首指针
      size_t rear;          // 队尾指针

      // 扩容函数：容量翻倍
      void resize() {
          size_t newCapacity = data.size() * 2;
          if (newCapacity == 0) newCapacity = 4;  // 初始容量设为4
          std::vector<T> newData(newCapacity);

          // 拷贝原有元素到新数组
          size_t idx = front;
          size_t i = 0;
          while (idx != rear) {
              newData[i++] = data[idx];
              idx = (idx + 1) % data.size();
          }

          // 更新指针和数组
          data = std::move(newData);
          front = 0;
          rear = i;
      }

  public:
      DynamicArrayQueue() : front(0), rear(0) {
          data.reserve(4);  // 预分配初始容量
      }

      bool isEmpty() const {
          return front == rear;
      }

      void enqueue(const T& value) {
          // 满了就扩容
          if ((rear + 1) % data.capacity() == front) {
              resize();
          }
          // 若数组为空（初始状态），先resize到初始容量
          if (data.empty()) {
              resize();
          }
          data[rear] = value;
          rear = (rear + 1) % data.capacity();
      }

      T dequeue() {
          if (isEmpty()) {
              throw std::underflow_error("Queue is empty, cannot dequeue");
          }
          T frontValue = data[front];
          front = (front + 1) % data.capacity();
          return frontValue;
      }

      T peek() const {
          if (isEmpty()) {
              throw std::underflow_error("Queue is empty, cannot peek");
          }
          return data[front];
      }

      size_t size() const {
          if (data.empty()) return 0;
          return (rear - front + data.capacity()) % data.capacity();
      }
  };
  ```

### 用链表实现队列

- 链表实现队列的核心是双指针（头指针 + 尾指针） 设计，利用单链表的 “尾插、头删” 特性适配队列的 FIFO 规则：
  1. 维护两个指针：
     - `front`：指向队列头部节点（待出队的元素）
     - `rear`：指向队列尾部节点（待入队的位置）

  2. 核心操作：
     - 入队（enqueue）：在链表尾部（`rear` 位置）插入新节点，更新 `rear` 指针
     - 出队（dequeue）：删除链表头部（`front` 位置）节点，更新 `front` 指针

  3. 边界处理：
     - 空队列：`front` 和 `rear` 均为 `nullptr`
     - 仅一个元素的队列：出队后需同时置空 `front` 和 `rear`

- 代码实现

  ```cpp
  #include <iostream>
  #include <stdexcept>  // 异常处理

  // 链表节点结构体
  template <typename T>
  struct ListNode {
      T val;            // 节点值
      ListNode* next;   // 指向下一个节点的指针
      // 构造函数
      ListNode(const T& value) : val(value), next(nullptr) {}
  };

  // 用单链表实现队列
  template <typename T>
  class LinkedQueue {
  private:
      ListNode<T>* front;  // 队首指针（指向第一个元素）
      ListNode<T>* rear;   // 队尾指针（指向最后一个元素）
      size_t count;        // 队列元素个数（可选，优化size()效率）

  public:
      // 构造函数：初始化空队列
      LinkedQueue() : front(nullptr), rear(nullptr), count(0) {}

      // 析构函数：释放所有节点内存，避免内存泄漏
      ~LinkedQueue() {
          while (front != nullptr) {
              ListNode<T>* temp = front;
              front = front->next;
              delete temp;
          }
          rear = nullptr;  // 防止野指针
          count = 0;
      }

      // 禁止拷贝构造和赋值（避免浅拷贝导致重复释放内存）
      LinkedQueue(const LinkedQueue&) = delete;
      LinkedQueue& operator=(const LinkedQueue&) = delete;

      // 判断队列是否为空
      bool isEmpty() const {
          return front == nullptr;  // 等价于 count == 0
      }

      // 获取队列元素个数
      size_t size() const {
          return count;  // 直接返回计数器，O(1)效率；若不存count，需遍历链表O(n)
      }

      // 入队：添加元素到队尾
      void enqueue(const T& value) {
          // 创建新节点
          ListNode<T>* newNode = new ListNode<T>(value);
          // 空队列：头指针和尾指针都指向新节点
          if (isEmpty()) {
              front = newNode;
              rear = newNode;
          } else {
              // 非空队列：尾节点的next指向新节点，更新尾指针
              rear->next = newNode;
              rear = newNode;
          }
          count++;  // 元素个数+1
      }

      // 出队：删除并返回队首元素
      T dequeue() {
          if (isEmpty()) {
              throw std::underflow_error("Queue is empty, cannot dequeue");
          }
          // 保存队首节点和值
          ListNode<T>* tempNode = front;
          T frontValue = tempNode->val;
          // 更新队首指针
          front = front->next;
          // 若出队后队列为空，尾指针也置空
          if (front == nullptr) {
              rear = nullptr;
          }
          // 释放原队首节点内存
          delete tempNode;
          count--;  // 元素个数-1
          return frontValue;
      }

      // 查看队首元素（不删除）
      T peek() const {
          if (isEmpty()) {
              throw std::underflow_error("Queue is empty, cannot peek");
          }
          return front->val;
      }

      // 打印队列（辅助测试）
      void print() const {
          if (isEmpty()) {
              std::cout << "Queue is empty" << std::endl;
              return;
          }
          std::cout << "Queue elements: ";
          ListNode<T>* curr = front;
          while (curr != nullptr) {
              std::cout << curr->val << " ";
              curr = curr->next;
          }
          std::cout << std::endl;
      }
  };
  ```

### 用两个队列实现栈

- 队列的核心是 “先进先出”，而栈需要 “后进先出”，核心思路是使用一个或两个队列来模拟栈的行为（这里推荐更易理解的双队列实现方式）：
  1.  主队列（mainQueue）：存储栈的所有元素，保持和栈逻辑一致的顺序
  2.  辅助队列（tempQueue）：临时存储元素，用于在入栈时调整顺序，让新元素出现在队列头部（模拟栈顶）
  3.  关键逻辑：每次入栈新元素时，先把主队列的所有元素转移到辅助队列，将新元素加入主队列，再把辅助队列的元素移回主队列 —— 这样新元素始终在主队列头部，出栈时直接取队首即可符合栈的 “后进先出” 特性

- 代码实现

  ```cpp
  #include <iostream>
  #include <queue>
  #include <stdexcept>  // 异常处理

  // 用两个队列实现栈
  template <typename T>
  class StackByQueue {
  private:
      std::queue<T> mainQueue;   // 主队列：存储栈元素，队首=栈顶
      std::queue<T> tempQueue;   // 辅助队列：临时转移元素

  public:
      // 入栈：将元素添加到栈顶
      void push(const T& value) {
          // 1. 把主队列所有元素转移到辅助队列
          while (!mainQueue.empty()) {
              tempQueue.push(mainQueue.front());
              mainQueue.pop();
          }
          // 2. 新元素加入主队列（此时主队列只有这个新元素，队首=栈顶）
          mainQueue.push(value);
          // 3. 把辅助队列的元素移回主队列
          while (!tempQueue.empty()) {
              mainQueue.push(tempQueue.front());
              tempQueue.pop();
          }
      }

      // 出栈：删除并返回栈顶元素
      T pop() {
          if (empty()) {
              throw std::underflow_error("Stack is empty, cannot pop");
          }
          T topValue = mainQueue.front();
          mainQueue.pop();
          return topValue;
      }

      // 查看栈顶元素（不删除）
      T top() const {
          if (empty()) {
              throw std::underflow_error("Stack is empty, cannot get top");
          }
          return mainQueue.front();
      }

      // 判断栈是否为空
      bool empty() const {
          return mainQueue.empty();
      }

      // 获取栈的元素个数
      size_t size() const {
          return mainQueue.size();
      }
  };

  // 简化版：单队列实现（无需辅助队列，更节省空间）
  template <typename T>
  class StackBySingleQueue {
  private:
      std::queue<T> q;

  public:
      void push(const T& value) {
          // 1. 先加入新元素
          q.push(value);
          // 2. 将前面所有元素依次出队再入队，让新元素到队首
          int n = q.size() - 1;
          for (int i = 0; i < n; ++i) {
              q.push(q.front());
              q.pop();
          }
      }

      T pop() {
          if (empty()) {
              throw std::underflow_error("Stack is empty, cannot pop");
          }
          T topValue = q.front();
          q.pop();
          return topValue;
      }

      T top() const {
          if (empty()) {
              throw std::underflow_error("Stack is empty, cannot get top");
          }
          return q.front();
      }

      bool empty() const {
          return q.empty();
      }

      size_t size() const {
          return q.size();
      }
  };
  ```

### 用一个队列实现栈

- 队列的特性是 “先进先出”，要模拟栈的 “后进先出”，关键是让新入队的元素始终出现在队列头部（栈顶）

- 仅用一个队列的核心逻辑：
  1.  入栈（push）：先将新元素加入队列尾部，然后把队列中除了这个新元素之外的所有旧元素依次出队再重新入队 —— 这样新元素会被 “推” 到队列头部，成为栈顶
  2.  出栈（pop）/ 查看栈顶（top）：直接操作队列头部元素即可（队列头部 = 栈顶），时间复杂度 O(1)

- 代码实现

  ```cpp
  #include <iostream>
  #include <queue>
  #include <stdexcept>  // 异常处理

  // 仅用一个队列实现栈
  template <typename T>
  class StackBySingleQueue {
  private:
      std::queue<T> q;  // 唯一的队列

  public:
      // 入栈：核心逻辑是调整队列顺序，让新元素在队首（栈顶）
      void push(const T& value) {
          int n = q.size();  // 记录入栈前的元素个数（旧元素数量）
          q.push(value);     // 新元素先入队尾

          // 将前面n个旧元素依次出队再入队，新元素自然到队首
          for (int i = 0; i < n; ++i) {
              q.push(q.front());  // 旧元素出队后重新入队尾
              q.pop();
          }
      }

      // 出栈：删除并返回栈顶元素（队首）
      T pop() {
          if (empty()) {
              throw std::underflow_error("Stack is empty, cannot pop");
          }
          T topValue = q.front();
          q.pop();
          return topValue;
      }

      // 查看栈顶元素（不删除）
      T top() const {
          if (empty()) {
              throw std::underflow_error("Stack is empty, cannot get top");
          }
          return q.front();
      }

      // 判断栈是否为空
      bool empty() const {
          return q.empty();
      }

      // 获取栈的元素个数
      size_t size() const {
          return q.size();
      }
  };
  ```

## 双端队列

### 故障键盘

- 题目：[2810. 故障键盘](https://leetcode.cn/problems/faulty-keyboard/description/)

- 可以使用一个双端队列，当每次输入 i 后，反转 push 的方向（前或后）

- 代码实现

  ```cpp
  class Solution {
  public:
      string finalString(string s) {
          deque<char> que;
          bool reversed = false;
          for (char ch : s) {
              if (ch == 'i')
                  reversed = !reversed;
              else if (reversed)
                  que.push_front(ch);
              else
                  que.push_back(ch);
          }
          string res;
          if (reversed) {
              while (!que.empty()) {
                  res += que.back();
                  que.pop_back();
              }
          } else {
              while (!que.empty()) {
                  res += que.front();
                  que.pop_front();
              }
          }
          return res;
      }
  };
  ```

- 可以使用 string 的迭代器构造方式

  ```cpp
  class Solution {
  public:
      string finalString(string s) {
          deque<char> q;
          bool tail = true;
          for (char c : s) {
              if (c == 'i') tail = !tail; // 修改添加方向
              else if (tail) q.push_back(c); // 加尾部
              else q.push_front(c); // 加头部
          }
          return tail ? string(q.begin(), q.end()) : string(q.rbegin(), q.rend());
      }
  };
  ```

### 你可以安排的最多任务数目

- 题目：[2071. 你可以安排的最多任务数目](https://leetcode.cn/problems/maximum-number-of-tasks-you-can-assign/description/)

### 用数组实现双端队列

- 数组实现双端队列的核心是循环数组（环形缓冲区）+ 双指针，相比普通数组队列，需要支持`front`和`rear`两个指针双向移动：
  1. 核心设计：
     - 维护`front`（队首指针，指向当前队首元素）和`rear`（队尾指针，指向队尾元素的下一个位置）
     - 数组容量`capacity`固定（或动态扩容），指针移动通过取模实现循环（`(idx ± 1) % capacity`）

  2. 关键规则：
     - 判空：`front == rear`
     - 判满：`(rear + 1) % capacity == front`（预留 1 个空位，避免空 / 满混淆）
     - 头部插入：`front`先向前（循环）移动 1 位，再放入元素
     - 尾部插入：先放入元素到`rear`位置，再将`rear`向后（循环）移动 1 位
     - 头部删除：`front`向后（循环）移动 1 位
     - 尾部删除：`rear`向前（循环）移动 1 位

- 代码实现

  ```cpp
  #include <iostream>
  #include <stdexcept>
  #include <vector>

  // 静态数组实现双端队列（固定容量）
  template <typename T, size_t DEFAULT_CAPACITY = 10>
  class ArrayDeque {
  private:
      T data[DEFAULT_CAPACITY];  // 存储元素的环形数组
      size_t front;              // 队首指针（指向队首元素）
      size_t rear;               // 队尾指针（指向队尾下一个位置）
      const size_t capacity;     // 数组容量（预留1位，实际可用capacity-1）

  public:
      // 构造函数：初始化空双端队列
      ArrayDeque() : front(0), rear(0), capacity(DEFAULT_CAPACITY) {}

      // 判断是否为空
      bool isEmpty() const {
          return front == rear;
      }

      // 判断是否已满
      bool isFull() const {
          return (rear + 1) % capacity == front;
      }

      // 获取元素个数
      size_t size() const {
          return (rear - front + capacity) % capacity;
      }

      // 头部插入（addFirst）
      void addFirst(const T& value) {
          if (isFull()) {
              throw std::overflow_error("Deque is full, cannot add to first");
          }
          // front向前移动（循环）：先减1再取模，避免负数
          front = (front - 1 + capacity) % capacity;
          data[front] = value;
      }

      // 尾部插入（addLast）
      void addLast(const T& value) {
          if (isFull()) {
              throw std::overflow_error("Deque is full, cannot add to last");
          }
          data[rear] = value;
          // rear向后移动（循环）
          rear = (rear + 1) % capacity;
      }

      // 头部删除（removeFirst）
      T removeFirst() {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty, cannot remove first");
          }
          T val = data[front];
          // front向后移动（循环）
          front = (front + 1) % capacity;
          return val;
      }

      // 尾部删除（removeLast）
      T removeLast() {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty, cannot remove last");
          }
          // rear向前移动（循环）
          rear = (rear - 1 + capacity) % capacity;
          return data[rear];
      }

      // 查看头部元素（peekFirst）
      T peekFirst() const {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty, cannot peek first");
          }
          return data[front];
      }

      // 查看尾部元素（peekLast）
      T peekLast() const {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty, cannot peek last");
          }
          // 取rear前一个位置的元素
          return data[(rear - 1 + capacity) % capacity];
      }

      // 打印双端队列（辅助测试）
      void print() const {
          if (isEmpty()) {
              std::cout << "Deque is empty" << std::endl;
              return;
          }
          std::cout << "Deque elements: ";
          size_t idx = front;
          while (idx != rear) {
              std::cout << data[idx] << " ";
              idx = (idx + 1) % capacity;
          }
          std::cout << std::endl;
      }
  };

  // 拓展：动态数组双端队列（自动扩容）
  template <typename T>
  class DynamicArrayDeque {
  private:
      std::vector<T> data;       // 动态数组
      size_t front;              // 队首指针
      size_t rear;               // 队尾指针

      // 扩容函数：容量翻倍
      void resize() {
          size_t oldCapacity = data.capacity();
          size_t newCapacity = (oldCapacity == 0) ? 4 : oldCapacity * 2;
          std::vector<T> newData(newCapacity);

          // 拷贝原有元素到新数组的起始位置
          size_t idx = front;
          size_t i = 0;
          while (idx != rear) {
              newData[i++] = data[idx];
              idx = (idx + 1) % oldCapacity;
          }

          // 更新指针和数组
          data = std::move(newData);
          front = 0;
          rear = i;
      }

  public:
      DynamicArrayDeque() : front(0), rear(0) {
          data.reserve(4);  // 初始预分配容量4
      }

      bool isEmpty() const {
          return front == rear;
      }

      size_t size() const {
          if (data.empty()) return 0;
          return (rear - front + data.capacity()) % data.capacity();
      }

      void addFirst(const T& value) {
          // 满了就扩容
          if (data.capacity() > 0 && (rear + 1) % data.capacity() == front) {
              resize();
          }
          // 初始空数组先扩容
          if (data.empty()) {
              resize();
          }
          front = (front - 1 + data.capacity()) % data.capacity();
          data[front] = value;
      }

      void addLast(const T& value) {
          if (data.capacity() > 0 && (rear + 1) % data.capacity() == front) {
              resize();
          }
          if (data.empty()) {
              resize();
          }
          data[rear] = value;
          rear = (rear + 1) % data.capacity();
      }

      T removeFirst() {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty, cannot remove first");
          }
          T val = data[front];
          front = (front + 1) % data.capacity();
          return val;
      }

      T removeLast() {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty, cannot remove last");
          }
          rear = (rear - 1 + data.capacity()) % data.capacity();
          return data[rear];
      }

      T peekFirst() const {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty, cannot peek first");
          }
          return data[front];
      }

      T peekLast() const {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty, cannot peek last");
          }
          return data[(rear - 1 + data.capacity()) % data.capacity()];
      }
  };

  // 测试代码
  int main() {
      try {
          // 测试静态数组双端队列
          std::cout << "=== 测试静态数组双端队列 ===" << std::endl;
          ArrayDeque<int, 5> deque;  // 容量5，实际可用4个位置
          deque.addLast(1);
          deque.addLast(2);
          deque.addFirst(0);
          deque.addLast(3);
          // deque.addFirst(-1);  // 取消注释抛出满队列异常

          deque.print();  // 输出: Deque elements: 0 1 2 3
          std::cout << "头部元素: " << deque.peekFirst() << std::endl;  // 0
          std::cout << "尾部元素: " << deque.peekLast() << std::endl;   // 3
          std::cout << "大小: " << deque.size() << std::endl;          // 4

          // 头部删除
          std::cout << "删除头部: " << deque.removeFirst() << std::endl;  // 0
          // 尾部删除
          std::cout << "删除尾部: " << deque.removeLast() << std::endl;   // 3
          deque.print();  // 输出: Deque elements: 1 2

          // 测试动态数组双端队列
          std::cout << "\n=== 测试动态数组双端队列 ===" << std::endl;
          DynamicArrayDeque<int> dynDeque;
          for (int i = 1; i <= 10; ++i) {
              dynDeque.addLast(i);  // 自动扩容，无需担心满队列
          }
          dynDeque.addFirst(0);
          std::cout << "头部元素: " << dynDeque.peekFirst() << std::endl;  // 0
          std::cout << "尾部元素: " << dynDeque.peekLast() << std::endl;   // 10
          std::cout << "大小: " << dynDeque.size() << std::endl;          // 11

          dynDeque.removeFirst();
          dynDeque.removeLast();
          std::cout << "删除后头部: " << dynDeque.peekFirst() << std::endl;  // 1
          std::cout << "删除后尾部: " << dynDeque.peekLast() << std::endl;   // 9

      } catch (const std::exception& e) {
          std::cerr << "异常: " << e.what() << std::endl;
      }

      return 0;
  }
  ```

### 用双向链表实现双端队列

- 双向链表双端队列最贴合 “语义” 的实现方式，C++ 标准库中 `std::list` 本质就是双向链表，可直接作为 Deque 的底层（或手动实现）
  1. 双向链表每个节点包含：`prev`（前驱指针）、`next`（后继指针）、`val`（值）
  2. 维护 `head`（头节点）和 `tail`（尾节点）两个指针：
     - 头部插入：新节点的`next`指向`head`，`head->prev`指向新节点，更新`head`为新节点
     - 尾部插入：新节点的`prev`指向`tail`，`tail->next`指向新节点，更新`tail`为新节点
     - 头部 / 尾部删除：直接修改`head`/`tail`指针，断开对应节点的链接即可

- 代码实现

  ```cpp
  // 双向链表节点
  template <typename T>
  struct DListNode {
      T val;
      DListNode* prev;
      DListNode* next;
      DListNode(const T& v) : val(v), prev(nullptr), next(nullptr) {}
  };

  // 双向链表实现双端队列
  template <typename T>
  class DLinkedDeque {
  private:
      DListNode<T>* head;
      DListNode<T>* tail;
      size_t count;

  public:
      DLinkedDeque() : head(nullptr), tail(nullptr), count(0) {}

      // 头部插入 O(1)
      void addFirst(const T& val) {
          DListNode<T>* newNode = new DListNode<T>(val);
          if (isEmpty()) {
              head = tail = newNode;
          } else {
              newNode->next = head;
              head->prev = newNode;
              head = newNode;
          }
          count++;
      }

      // 尾部插入 O(1)
      void addLast(const T& val) {
          DListNode<T>* newNode = new DListNode<T>(val);
          if (isEmpty()) {
              head = tail = newNode;
          } else {
              newNode->prev = tail;
              tail->next = newNode;
              tail = newNode;
          }
          count++;
      }

      // 头部删除 O(1)
      T removeFirst() {
          if (isEmpty()) throw std::underflow_error("Deque empty");
          DListNode<T>* temp = head;
          T val = temp->val;
          head = head->next;
          if (head) head->prev = nullptr;
          else tail = nullptr; // 删空了
          delete temp;
          count--;
          return val;
      }

      // 尾部删除 O(1)
      T removeLast() {
          if (isEmpty()) throw std::underflow_error("Deque empty");
          DListNode<T>* temp = tail;
          T val = temp->val;
          tail = tail->prev;
          if (tail) tail->next = nullptr;
          else head = nullptr;
          delete temp;
          count--;
          return val;
      }

      bool isEmpty() const { return count == 0; }
      size_t size() const { return count; }
  };
  ```

### 用分段数组实现双端队列

- 分段数组是数组的 “进阶版”，也是 C++ 标准库`std::deque`的真实实现方式（非单一数组，而是 “中控数组 + 分段缓冲区”）
  - 中控数组（Map）：一个动态数组，存储指向 “分段缓冲区” 的指针
  - 分段缓冲区：固定大小的连续内存块（如 512 字节），存储实际元素
  - 两端操作逻辑：
    - 头部插入：若头部缓冲区有空闲，直接插入；无空闲则分配新缓冲区，加入中控数组头部
    - 尾部插入：同理，尾部缓冲区满则分配新缓冲区，加入中控数组尾部
    - 头部 / 尾部删除：直接操作对应缓冲区的指针，缓冲区空则从中控数组移除

### 用栈实现双端队列

- 栈的特点是后进先出（LIFO），而双端队列需要支持两端操作。核心思路是使用两个栈来模拟双端队列：
  1.  输入栈（in_stack）：负责处理队列的尾部插入操作
  2.  输出栈（out_stack）：负责处理队列的头部删除 / 查看操作
  3.  当需要从头部操作（如删除、查看）时，如果输出栈为空，就把输入栈的所有元素依次弹出并压入输出栈，这样输入栈的底部元素（最早入队的）就会出现在输出栈的顶部，从而实现队列的先进先出特性。
  4.  对于头部插入操作，可以先把输出栈的元素倒回输入栈，再把新元素压入输入栈（相当于插入到队列头部）；尾部删除操作则需要把输入栈元素倒到输出栈，删除输出栈底部元素（或反向操作）

- 代码实现

  ```cpp
  #include <iostream>
  #include <stack>
  #include <stdexcept>  // 用于异常处理

  // 基于两个栈实现的双端队列类
  template <typename T>
  class StackBasedDeque {
  private:
      std::stack<T> in_stack;   // 输入栈：处理尾部插入
      std::stack<T> out_stack;  // 输出栈：处理头部操作

      // 辅助函数：将from_stack的所有元素转移到to_stack
      void transfer(std::stack<T>& from_stack, std::stack<T>& to_stack) {
          while (!from_stack.empty()) {
              to_stack.push(from_stack.top());
              from_stack.pop();
          }
      }

  public:
      // 判断双端队列是否为空
      bool isEmpty() const {
          return in_stack.empty() && out_stack.empty();
      }

      // 获取双端队列的元素个数
      size_t size() const {
          return in_stack.size() + out_stack.size();
      }

      // 在头部插入元素
      void addFirst(const T& item) {
          // 先把输出栈的元素倒回输入栈，再插入新元素到输入栈（即队列头部）
          transfer(out_stack, in_stack);
          in_stack.push(item);
      }

      // 在尾部插入元素
      void addLast(const T& item) {
          // 直接压入输入栈
          in_stack.push(item);
      }

      // 删除并返回头部元素
      T removeFirst() {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty: cannot remove from first");
          }
          // 如果输出栈为空，将输入栈元素转移到输出栈
          if (out_stack.empty()) {
              transfer(in_stack, out_stack);
          }
          T top_item = out_stack.top();
          out_stack.pop();
          return top_item;
      }

      // 删除并返回尾部元素
      T removeLast() {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty: cannot remove from last");
          }
          // 如果输入栈为空，将输出栈元素转移到输入栈
          if (in_stack.empty()) {
              transfer(out_stack, in_stack);
          }
          T top_item = in_stack.top();
          in_stack.pop();
          return top_item;
      }

      // 查看头部元素（不删除）
      T peekFirst() const {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty: cannot peek first");
          }
          // 注意：const成员函数不能修改成员变量，因此需要临时拷贝栈来转移
          std::stack<T> temp_in = in_stack;
          std::stack<T> temp_out = out_stack;
          if (temp_out.empty()) {
              while (!temp_in.empty()) {
                  temp_out.push(temp_in.top());
                  temp_in.pop();
              }
          }
          return temp_out.top();
      }

      // 查看尾部元素（不删除）
      T peekLast() const {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty: cannot peek last");
          }
          // 同理，使用临时栈避免修改原数据
          std::stack<T> temp_in = in_stack;
          std::stack<T> temp_out = out_stack;
          if (temp_in.empty()) {
              while (!temp_out.empty()) {
                  temp_in.push(temp_out.top());
                  temp_out.pop();
              }
          }
          return temp_in.top();
      }
  };
  ```

### 用队列实现双端队列

- 普通队列仅支持尾部入队、头部出队，要实现双端队列的两端操作，核心是用两个普通队列分工协作，结合 “元素转移” 模拟双端操作：
  1. 主队列（mainQ）：存储双端队列的核心元素，默认处理尾部插入 / 头部删除
  2. 辅助队列（tempQ）：临时转移元素，用于实现 “头部插入” 和 “尾部删除” 操作
  3. 核心逻辑：
     - 尾部插入（addLast）：直接入队主队列（O(1)）
     - 头部删除（removeFirst）：直接出队主队列（O(1)）
     - 头部插入（addFirst）：先将主队列所有元素转移到辅助队列，新元素入队主队列，再把辅助队列元素移回主队列（让新元素成为队首）
     - 尾部删除（removeLast）：将主队列前 n-1 个元素转移到辅助队列，删除主队列最后一个元素，再把辅助队列元素移回主队列

- 代码实现

  ```cpp
  #include <iostream>
  #include <queue>
  #include <stdexcept>  // 异常处理

  // 用两个普通队列实现双端队列
  template <typename T>
  class DequeByQueue {
  private:
      std::queue<T> mainQ;   // 主队列：核心存储
      std::queue<T> tempQ;   // 辅助队列：临时转移元素

      // 辅助函数：将fromQ的所有元素转移到toQ
      void transfer(std::queue<T>& fromQ, std::queue<T>& toQ) {
          while (!fromQ.empty()) {
              toQ.push(fromQ.front());
              fromQ.pop();
          }
      }

  public:
      // 判断双端队列是否为空
      bool isEmpty() const {
          return mainQ.empty();
      }

      // 获取元素个数
      size_t size() const {
          return mainQ.size();
      }

      // 头部插入元素（addFirst）
      void addFirst(const T& value) {
          // 1. 主队列元素转移到辅助队列
          transfer(mainQ, tempQ);
          // 2. 新元素入队主队列（成为队首）
          mainQ.push(value);
          // 3. 辅助队列元素移回主队列
          transfer(tempQ, mainQ);
      }

      // 尾部插入元素（addLast）
      void addLast(const T& value) {
          // 直接入队主队列，O(1)
          mainQ.push(value);
      }

      // 头部删除元素（removeFirst）
      T removeFirst() {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty, cannot remove first");
          }
          // 直接出队主队列队首，O(1)
          T frontVal = mainQ.front();
          mainQ.pop();
          return frontVal;
      }

      // 尾部删除元素（removeLast）
      T removeLast() {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty, cannot remove last");
          }
          size_t n = mainQ.size();
          // 1. 转移前n-1个元素到辅助队列
          for (size_t i = 0; i < n - 1; ++i) {
              tempQ.push(mainQ.front());
              mainQ.pop();
          }
          // 2. 主队列剩余的最后一个元素就是要删除的尾部元素
          T rearVal = mainQ.front();
          mainQ.pop();
          // 3. 辅助队列元素移回主队列
          transfer(tempQ, mainQ);
          return rearVal;
      }

      // 查看头部元素（peekFirst）
      T peekFirst() const {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty, cannot peek first");
          }
          return mainQ.front();
      }

      // 查看尾部元素（peekLast）
      T peekLast() const {
          if (isEmpty()) {
              throw std::underflow_error("Deque is empty, cannot peek last");
          }
          // const函数不能修改原队列，拷贝到临时队列处理
          std::queue<T> temp = mainQ;
          // 遍历到队尾
          while (temp.size() > 1) {
              temp.pop();
          }
          return temp.front();
      }

      // 打印队列（辅助测试）
      void print() const {
          if (isEmpty()) {
              std::cout << "Deque is empty" << std::endl;
              return;
          }
          std::queue<T> temp = mainQ;
          std::cout << "Deque elements: ";
          while (!temp.empty()) {
              std::cout << temp.front() << " ";
              temp.pop();
          }
          std::cout << std::endl;
      }
  };
  ```

## 单调队列

### 基本思想

- 单调队列的核心是维护队列内元素的单调性（递增 / 递减），主要解决「滑动窗口类的极值问题」，能在 O (n) 时间内找到每个滑动窗口的最大值 / 最小值

- 单调队列的本质是「在遍历过程中，动态维护一个有序队列，只保留对当前 / 未来窗口有用的元素」，分为两种：
  - 单调递减队列：队头是当前窗口的最大值（队列内元素从队头到队尾递减）
  - 单调递增队列：队头是当前窗口的最小值（队列内元素从队头到队尾递增）

- 核心操作（以「滑动窗口最大值」为例，单调递减队列）
  - 入队：新元素入队尾前，删除队列中所有比它小的元素（这些元素不可能成为后续窗口的最大值，无需保留）；
  - 出队：如果队头元素的下标超出当前窗口的左边界，从队头删除；
  - 取极值：每个位置的队头元素就是当前窗口的最大值

- 延伸场景：带窗口限制的极值问题
  - 滑动窗口的中位数：结合两个单调队列（一个大顶堆 + 一个小顶堆）维护窗口内元素的有序性，本质是单调队列的进阶应用；

  - 满足条件的子数组数目（比如和 ≤k 且长度 ≤m）：用单调队列维护前缀和的单调性，快速找到满足条件的窗口边界

### 滑动窗口最大值

- 给定一个数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位

- 返回滑动窗口中的最大值，并在线性时间复杂度内解决此题

- 示例代码

  ```cpp
  class Solution {
  public:
      vector<int> maxSlidingWindow(vector<int>& nums, int k) {
          deque<int> que;
          vector<int> res;
          for (int l = 0, r = 0; r < nums.size(); r++) {
              while (!que.empty() && nums[que.back()] < nums[r]) {
                  que.pop_back();
              }
              que.push_back(r);
              while (r - l + 1 > k) {
                  if (!que.empty() && que.front() == l) {
                      que.pop_front();
                  }
                  l++;
              }
              if (r - l + 1 == k) {
                  res.push_back(nums[que.front()]);
              }
          }
          return res;
      }
  };
  ```

- 参考题目
  - [239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)
  - [76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/description/)
  - [155. 最小栈](https://leetcode.cn/problems/min-stack/)
    - 改成队列或双端队列如何实现？
    - 如何不使用额外存储空间？
  - [480. 滑动窗口中位数](https://leetcode.cn/problems/sliding-window-median/)
  - [2653. 滑动子数组的美丽值](https://leetcode.cn/problems/sliding-subarray-beauty/)

### 设计自助结算系统

- 题目：[LCR 184. 设计自助结算系统](https://leetcode.cn/problems/dui-lie-de-zui-da-zhi-lcof/description/)

- 可以用一个数组维护商品，另一个双端队列维护窗口最大值

  ```cpp
  class Checkout {
  public:
      int left = 0;
      vector<int> goods;
      deque<int> que;
      Checkout() {}

      int get_max() {
          if (empty())
              return -1;
          // std::cout << "Max: " << goods[que.front()] << endl;
          return goods[que.front()];
      }

      void add(int value) {
          goods.push_back(value);
          while (!que.empty() && goods[que.back()] < value) {
              que.pop_back();
          }
          // std::cout << "Push: " << value << " with " << goods.size() - 1 << endl;
          que.push_back(goods.size() - 1);
      }

      int remove() {
          if (empty())
              return -1;
          if (que.front() == left) {
              // std::cout << "Remove: " << goods[left] << endl;
              que.pop_front();
          }
          return goods[left++];
      }
      bool empty() { return que.empty(); }
  };

  /**
   * Your Checkout object will be instantiated and called as such:
   * Checkout* obj = new Checkout();
   * int param_1 = obj->get_max();
   * obj->add(value);
   * int param_3 = obj->remove();
   */
  ```

- 但是数组的底层不断扩容的时间开销较大，可以预先分配一定的容量

  ```cpp
  #include <vector>
  #include <deque>
  using namespace std;

  class Checkout {
  public:
      int left = 0;
      vector<int> goods;
      deque<int> que;

      // 新增：支持指定初始容量的构造函数
      Checkout(int initial_capacity = 10000) {
          // 预分配容量，避免频繁扩容
          goods.reserve(initial_capacity);
      }

      int get_max() {
          if (empty())
              return -1;
          return goods[que.front()];
      }

      void add(int value) {
          goods.push_back(value);
          while (!que.empty() && goods[que.back()] < value) {
              que.pop_back();
          }
          que.push_back(goods.size() - 1);
      }

      int remove() {
          if (empty())
              return -1;
          if (que.front() == left) {
              que.pop_front();
          }
          return goods[left++];
      }

      bool empty() {
          return left >= goods.size();
      }

      // 新增：动态扩容时的手动调整（可选）
      void reserve_more(int new_capacity) {
          goods.reserve(new_capacity);
      }
  };
  ```

### 绝对差不超过限制的最长连续子数组

- 题目：[1438. 绝对差不超过限制的最长连续子数组](https://leetcode.cn/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/description/)

- 需要维护窗口的最大值和最小值

- 代码实现

  ```cpp
  class Solution {
  public:
      int longestSubarray(vector<int>& nums, int limit) {
          int n = nums.size();
          deque<int> mx;
          deque<int> mn;
          int ans = 0;
          for (int l = 0, r = 0; r < n; r++) {
              while (!mx.empty() && nums[mx.back()] < nums[r]) {
                  mx.pop_back();
              }
              mx.push_back(r);
              while (!mn.empty() && nums[mn.back()] > nums[r]) {
                  mn.pop_back();
              }
              mn.push_back(r);
              while (nums[mx.front()] - nums[mn.front()] > limit) {
                  if (mx.front() == l)
                      mx.pop_front();
                  if (mn.front() == l)
                      mn.pop_front();
                  l++;
              }
              ans = max(ans, r - l + 1);
          }
          return ans;
      }
  };
  ```

- l 右移的逻辑可以进一步优化，l 直接跳到临界位置，而非逐次+1

  ```cpp
  class Solution {
  public:
      int longestSubarray(vector<int>& nums, int limit) {
          int n = nums.size();
          deque<int> mx;
          deque<int> mn;
          int ans = 0;
          for (int l = 0, r = 0; r < n; r++) {
              while (!mx.empty() && nums[mx.back()] < nums[r]) {
                  mx.pop_back();
              }
              mx.push_back(r);
              while (!mn.empty() && nums[mn.back()] > nums[r]) {
                  mn.pop_back();
              }
              mn.push_back(r);
              while (nums[mx.front()] - nums[mn.front()] > limit) {
                  // 找到需要移除的那个元素的索引（要么是最大值的位置，要么是最小值的位置）
                  int remove_idx = min(mx.front(), mn.front());
                  // l 直接跳到 remove_idx + 1，一步到位
                  l = remove_idx + 1;
                  if (mx.front() < l)
                      mx.pop_front();
                  if (mn.front() < l)
                      mn.pop_front();
              }
              ans = max(ans, r - l + 1);
          }
          return ans;
      }
  };
  ```

### 不间断子数组

- 题目：[2762. 不间断子数组](https://leetcode.cn/problems/continuous-subarrays/)

- 与上一题类似，需要维护窗口的最大值和最小值

  ```cpp
  class Solution {
  public:
      long long continuousSubarrays(vector<int>& nums) {
          int n = nums.size();
          long long ans = 0;
          std::deque<int> max_que;
          std::deque<int> min_que;
          for (int l = 0, r = 0; r < n; r++) {
              while (!max_que.empty() && nums[max_que.back()] < nums[r]) {
                  max_que.pop_back();
              }
              max_que.push_back(r);
              while (!min_que.empty() && nums[min_que.back()] > nums[r]) {
                  min_que.pop_back();
              }
              min_que.push_back(r);
              while (nums[max_que.front()] - nums[min_que.front()] > 2) {
                  if (max_que.front() == l)
                      max_que.pop_front();
                  if (min_que.front() == l)
                      min_que.pop_front();
                  l++;
              }
              ans += r - l + 1;
          }
          return ans;
      }
  };
  ```

### 预算内的最多机器人数目

- 题目：[2398. 预算内的最多机器人数目](https://leetcode.cn/problems/maximum-number-of-robots-within-budget/description/)

- 维护窗口内最大值和窗口内的总和即可，代码实现

  ```cpp
  class Solution {
  public:
      int maximumRobots(vector<int>& chargeTimes, vector<int>& runningCosts,
                        long long budget) {
          deque<int> que;
          long long sum = 0;
          int ans = 0;
          for (int l = 0, r = 0; r < chargeTimes.size(); r++) {
              while (!que.empty() && chargeTimes[que.back()] < chargeTimes[r]) {
                  que.pop_back();
              }
              que.push_back(r);
              sum += runningCosts[r];
              while (!que.empty() &&
                     (chargeTimes[que.front()] + (r - l + 1) * sum) > budget) {
                  if (que.front() == l) {
                      que.pop_front();
                  }
                  sum -= runningCosts[l];
                  l++;
              }
              ans = max(ans, r - l + 1);
          }
          return ans;
      }
  };
  ```

### 计数质数间隔平衡子数组

- 题目：[3589. 计数质数间隔平衡子数组](https://leetcode.cn/problems/count-prime-gap-balanced-subarrays/description/)

- 需要维护窗口内的最大和最小质数，当满足质数大于 2 个时更新答案，但是注意要维护当前位置前两个质数的位置，更新答案的时候使用上上一个质数的位置减去左边界+1 来更新

- 可以使用欧拉筛先生成质数数组

  ```cpp
  class Solution {
  public:
      vector<bool> euler_sieve(int n) {
          if (n < 2) {
              return {};
          }

          vector<bool> is_prime(n + 1, true);
          is_prime[0] = is_prime[1] = false;
          vector<int> primes;

          for (int i = 2; i <= n; ++i) {
              if (is_prime[i]) {
                  primes.push_back(i);
              }

              for (int p : primes) {
                  long long composite = (long long)i * p;
                  if (composite > n) {
                      break;
                  }
                  is_prime[composite] = false;
                  if (i % p == 0) {
                      break;
                  }
              }
          }

          return is_prime;
      }
      int primeSubarray(vector<int>& nums, int k) {
          deque<int> mx, mn;
          int ans = 0;
          int primeCnt = 0;
          int last2PrimeIdx = -1, lastPrimeIdx = -1;
          int mxValue = 0;
          for (int i = 0; i < nums.size(); i++) {
              mxValue = max(mxValue, nums[i]);
          }
          vector<bool> is_prime = euler_sieve(mxValue + 1);
          for (int l = 0, r = 0; r < nums.size(); r++) {
              if (is_prime[nums[r]]) {
                  primeCnt++;
                  while (!mx.empty() && nums[mx.back()] < nums[r]) {
                      mx.pop_back();
                  }
                  mx.push_back(r);
                  while (!mn.empty() && nums[mn.back()] > nums[r]) {
                      mn.pop_back();
                  }
                  mn.push_back(r);
                  if (lastPrimeIdx == -1) {
                      lastPrimeIdx = r;
                  } else {
                      last2PrimeIdx = lastPrimeIdx;
                      lastPrimeIdx = r;
                  }
              }
              while (!mx.empty() && !mn.empty() &&
                     nums[mx.front()] - nums[mn.front()] > k) {
                  if (mx.front() == l) {
                      primeCnt--;
                      mx.pop_front();
                  }
                  if (mn.front() == l) {
                      primeCnt--;
                      mn.pop_front();
                  }
                  l++;
              }
              if (primeCnt >= 2) {
                  ans += last2PrimeIdx - l + 1;
              }
          }
          return ans;
      }
  };
  ```

### 满足不等式的最大值

- 题目：[1499. 满足不等式的最大值](https://leetcode.cn/problems/max-value-of-equation/description/)

- 显然，可以使用滑动窗口维护 |x_min-x_max|\<=k 的窗口，然后更新任意两点的对应最大值，代码实现

  ```cpp
  class Solution {
  public:
      int findMaxValueOfEquation(vector<vector<int>>& points, int k) {
          int n = points.size();
          int ans = 0;
          for (int l = 0, r = 0; r < n; r++) {
              while (points[r][0] - points[l][0] > k) {
                  l++;
              }
              for (int i = l; i <= r - 1; i++) {
                  for (int j = l + 1; j <= r; j++) {
                      ans = max(ans, points[i][1] + points[j][1] + points[j][0] -
                                         points[i][0]);
                  }
              }
          }
          return ans;
      }
  };
  ```

- 然而，对于每个窗口都这样遍历，其时间复杂度太高，如果针对所求 `yi + yj + |xi - xj|` 的最大值进行优化？

- 进行问题转化，对于 j\<i 而言，所求值为 `yi+xi+yj-xj`，那么遍历当前值 i 时，即需要找到左侧的最大的 `yj-xj`，显然，可以通过单调队列来实现，实时维护最大的 `yj-xj` 即可，这也正是枚举右维护左的应用，从而能够将两层遍历转换为一次遍历

- 单调队列实现细节
  - 需要先把队首的超出 k 范围的数据出队
  - 然后将当前元素入队，入队前如果发现不小于队尾的数据，那么将队尾元素弹出
  - 注意这里弹出队尾元素是也要弹出等于的元素，如果不移除相等的元素，也不会出错，但是队列会冗余存储大量相同值的元素，会增加队列的操作次数

  ```cpp
  int findMaxValueOfEquation(vector<vector<int>>& points, int k) {
      // 单调队列，存储点的索引，队列中的元素按 (y - x) 从大到小排列
      deque<int> q;
      int max_value = INT_MIN;
      int n = points.size();

      for (int j = 0; j < n; ++j) {
          int xj = points[j][0];
          int yj = points[j][1];

          // 第一步：移除窗口外的点（xj - xi > k）
          while (!q.empty() && xj - points[q.front()][0] > k) {
              q.pop_front();
          }

          // 第二步：计算当前j对应的最大值
          if (!q.empty()) {
              int i = q.front();
              int xi = points[i][0];
              int yi = points[i][1];
              int current = (yj + xj) + (yi - xi);
              max_value = max(max_value, current);
          }

          // 第三步：维护单调队列，移除队尾小于等于当前值的元素
          int current_val = yj - xj;
          while (!q.empty() && (points[q.back()][1] - points[q.back()][0]) <= current_val) {
              q.pop_back();
          }

          // 将当前索引加入队列
          q.push_back(j);
      }

      return max_value;
  }
  ```

### 跳跃游戏 VI

- 给你一个下标从 0 开始的整数数组 nums 和一个整数 k

- 一开始你在下标 0 处。每一步，你最多可以往前跳 k 步，但你不能跳出数组的边界。也就是说，你可以从下标 i 跳到 [i + 1， min(n - 1, i + k)] 包含 两个端点的任意位置

- 你的目标是到达数组最后一个位置（下标为 n - 1 ），你的 得分 为经过的所有数字之和

- 请你返回你能得到的 最大得分

- 初看这道题，可以用动态规划解决，dp[i] 表示下标为 i 位置的最大得分，那么 `dp[i]=max(dp[i],dp[j]+nums[i])`

- 但是题目要求必须要从 0 出发，那么需要初始化其他位置为 INT_MIN 表示不可达，也就无法计入 max 中

  ```cpp
  class Solution {
  public:
      int maxResult(vector<int>& nums, int k) {
          int n = nums.size();
          vector<int> dp(n, INT_MIN);
          dp[0] = nums[0];
          for (int i = 0; i < n; i++) {
              for (int j = max(i - k, 0); j < i; j++) {
                  if (dp[j] == INT_MIN)
                      continue;
                  dp[i] = max(dp[i], dp[j] + nums[i]);
              }
          }
          return dp[n - 1];
      }
  };
  ```

- 但是这个代码会超时，其时间复杂度是 $O(n^2)$，那么如何优化？

- 实际上，可以用单调队列维护窗口内的最大值，每次从能够获取最大值的位置跳转至当前位置，代码实现

  ```cpp
  class Solution {
  public:
      int maxResult(vector<int>& nums, int k) {
          int n = nums.size();
          vector<int> dp(n);
          dp[0] = nums[0];

          // 单调队列：存下标，队头是窗口内 dp 值最大的
          deque<int> q;
          q.push_back(0);

          for (int i = 1; i < n; i++) {
              // 超出窗口 k 范围，弹出队头
              while (!q.empty() && q.front() < i - k) {
                  q.pop_front();
              }

              // 从窗口最大的位置跳过来
              dp[i] = dp[q.front()] + nums[i];

              // 维护单调递减队列
              while (!q.empty() && dp[i] >= dp[q.back()]) {
                  q.pop_back();
              }
              q.push_back(i);
          }
          return dp.back();
      }
  };
  ```

- 那么，如果把 k 改成一个数组 jumpLimits，其中 jumpLimits[i] 表示从下标 i 处向右跳，至多可以跳 jumpLimits[i] 步呢？

- 动态规划做法依旧可以更改条件即可

  ```cpp
  class Solution {
  public:
      int maxResult(vector<int>& nums, vector<int>& jumpLimits) {
          int n = nums.size();
          vector<int> dp(n, INT_MIN);
          dp[0] = nums[0];

          for (int i = 1; i < n; i++) {
              // 找所有能跳到 i 的 j
              for (int j = 0; j < i; j++) {
                  // j 必须能跳到 i：向右最多跳 jumpLimits[j] 步
                  if (i <= j + jumpLimits[j]) {
                      if (dp[j] != INT_MIN) {
                          dp[i] = max(dp[i], dp[j] + nums[i]);
                      }
                  }
              }
          }
          return dp[n-1];
      }
  };
  ```

- 因为每个位置 j 能覆盖一段区间 j ~ j + jumpLimits[j]，我们需要在一段区间里取 dp 最大值，因此用线段树最优 $O(n\log n)$

- 代码实现

  ```cpp
  class Solution {
  public:
      vector<int> tree;
      int n;

      void update(int node, int l, int r, int idx, int val) {
          if (l == r) {
              tree[node] = val;
              return;
          }
          int mid = (l + r) / 2;
          if (idx <= mid)
              update(2*node, l, mid, idx, val);
          else
              update(2*node+1, mid+1, r, idx, val);
          tree[node] = max(tree[2*node], tree[2*node+1]);
      }

      int query(int node, int l, int r, int ql, int qr) {
          if (qr < l || ql > r) return INT_MIN;
          if (ql <= l && r <= qr) return tree[node];
          int mid = (l + r)/2;
          return max(query(2*node,l,mid,ql,qr), query(2*node+1,mid+1,r,ql,qr));
      }

      int maxResult(vector<int>& nums, vector<int>& jumpLimits) {
          n = nums.size();
          tree.resize(4 * n, INT_MIN);
          vector<int> dp(n, INT_MIN);
          dp[0] = nums[0];
          update(1, 0, n-1, 0, dp[0]);

          for (int i = 1; i < n; i++) {
              // 能跳到 i 的 j 范围：左无限制，右最多 i（j < i）
              // j 满足 j + jumpLimits[j] >= i
              // 但优化写法：我们用 j 去更新区间
              // 这里用反向：求所有 j <= i 且 j >= i - jumpLimits[j]（不适用）
              // 正确标准写法：i 可以被 j 覆盖，查询 j 能覆盖 i 的区间最大值
              int L = 0;
              int R = i-1;
              int mx = query(1, 0, n-1, L, R);
              if (mx != INT_MIN)
                  dp[i] = mx + nums[i];
              update(1, 0, n-1, i, dp[i]);
          }
          return dp[n-1];
      }
  };
  ```

## 单调栈

### 基本思想

- 单调栈
  - 单调栈的核心价值是在 O (n) 时间内找到数组中每个元素的「左右第一个极值（更大 / 更小）元素」
  - 本质是空间换时间，因为在遍历的过程中需要用一个栈来记录右边第一个比当前元素高的元素，优点是整个数组只需要遍历一次
  - 当需要在一维数组中，查找任意元素左侧或右侧第一个比它大（或小）的元素位置时，单调栈是最优选择，其时间复杂度可达到 $O (n)$

- 单调栈中存放的是元素的下标 i，从栈顶到栈底的顺序
  - 如果求一个元素右边第一个更大元素，单调栈就是递增的
  - 如果求一个元素右边第一个更小元素，单调栈就是递减的

- 延申场景：基于「首个极值」的面积 / 长度计算，先通过单调栈找到每个元素的左右极值边界，再基于边界计算面积 / 长度
  - 柱状图中最大矩形：计算柱状图中最大矩形面积——维护单调递增栈，找到每个柱子左右第一个更矮的柱子（边界），宽度 = 右边界 - 左边界 - 1，面积 = 高度 × 宽度
  - 最大矩形（二维矩阵）：给定 0/1 矩阵，找全是 1 的最大矩形面积——将矩阵按行转化为「柱状图高度数组」（连续 1 的高度），再调用「柱状图最大矩形」的单调栈解法
  - 最长有效括号

- 进阶场景：单调栈的本质是「遍历过程中维护栈内元素的单调性」，因此可用于需要「动态保持有序」的场景
  - 去除重复字母（最小字典序）：移除字符串中重复字符，使结果字典序最小且保留所有字符——维护单调递增栈，遍历字符时，若当前字符更小且栈顶字符后续还有，则弹出栈顶（去重），最终栈内即为最小字典序
  - 移掉 K 位数字：移除 k 个数字，使剩余数字最小——维护单调递增栈，遍历数字时，若当前数字更小且还有移除次数（k>0），则弹出栈顶（移掉大数字），最后截断剩余 k 位，处理前导零

- 代码实现
  - 对数组中每个元素 `nums[i]`，找到左侧最近的严格大于它的元素下标（`left[i]`），不存在则为 `-1`（作为 “哨兵下标”）

  - 找到右侧最近的严格大于它的元素下标（`right[i]`），不存在则为 `n`（数组长度，作为 “哨兵下标”）

    最终返回这两个下标数组组成的 pair

  ```cpp
  pair<vector<int>, vector<int>> nearestGreater(vector<int>& nums) {
      int n = nums.size();
      // left[i] 是 nums[i] 左侧最近的严格大于 nums[i] 的数的下标，若不存在则为 -1
      vector<int> left(n);
      vector<int> st{-1}; // 哨兵
      for (int i = 0; i < n; i++) {
          int x = nums[i];
          while (st.size() > 1 && nums[st.back()] <= x) { // 如果求严格小于，改成 >=
              st.pop_back();
          }
          left[i] = st.back();
          st.push_back(i);
      }

      // right[i] 是 nums[i] 右侧最近的严格大于 nums[i] 的数的下标，若不存在则为 n
      vector<int> right(n);
      st = {n}; // 哨兵
      for (int i = n - 1; i >= 0; i--) {
          int x = nums[i];
          while (st.size() > 1 && nums[st.back()] <= x) { // 如果求严格小于，改成 >=
              st.pop_back();
          }
          right[i] = st.back();
          st.push_back(i);
      }

      return {left, right};
  }
  ```

### 单调栈与单调队列

- 单调栈（Monotonic Stack）
  - 定义：栈内元素始终保持严格递增 / 递减顺序的栈结构（可分为单调递增栈、单调递减栈）

  - 本质：**一维**的、**只在一端（栈顶）**进行插入 / 删除操作的单调结构，核心是「后进先出（LIFO）」

  - 核心逻辑：新元素入栈前，弹出所有破坏单调性的栈顶元素，再入栈，保证栈内单调性不变
  - 主要用于：找「单侧」边界（如下一个更大元素）

- 单调队列（Monotonic Queue）
  - 定义：队列内元素始终保持严格递增 / 递减顺序的队列结构（可分为单调递增队列、单调递减队列）

  - 本质：**一维**的、**两端（队头 / 队尾）**都可进行插入 / 删除操作的单调结构，核心是「先进先出（FIFO）」，但为了维护单调性，队头 / 队尾都能弹出元素

  - 核心逻辑：新元素入队尾前，弹出队尾所有破坏单调性的元素；同时，若队头元素超出当前处理区间，也需弹出队头
  - 主要用于：找「区间」最值（如滑动窗口最大值）

- 单调队列本质上就是「滑动窗口」的边界约束 +「单调栈」的单调性约束结合而成的结构，是专门解决「滑动窗口最值问题」的最优解

### 每日温度

- 根据每日气温列表，重新生成一个列表。对应位置的输出为：要想观测到更高的气温，至少需要等待的天数。如果气温在这之后都不会升高，在该位置用 0 来代替

- 例如，给定一个列表 temperatures = [73, 74, 75, 71, 69, 72, 76, 73]，输出应该是 [1, 1, 4, 2, 1, 1, 0, 0]

- 提示：气温列表长度的范围是 [1, 30000]。每个气温的值的均为华氏度，都是在 [30, 100] 范围内的整数

- 代码实现

  ```cpp
  class Solution {
  public:
      vector<int> dailyTemperatures(vector<int>& temperatures) {
          int n = temperatures.size();
          vector<int> ans(n);
          stack<int> st;
          for (int i = n - 1; i >= 0; i--) {
              int t = temperatures[i];
              while (!st.empty() && t >= temperatures[st.top()]) {
                  st.pop();
              }
              if (!st.empty()) {
                  ans[i] = st.top() - i;
              }
              st.push(i);
          }
          return ans;
      }
  };
  ```

- 以上代码是从右向左遍历，因此更新的是当前遍历的元素下标 i，遍历过程如下：
  1. 从右往左走，先处理右侧的元素，栈中保留的是 “右侧更高的山峰下标”；
  2. 遇到当前温度 `t`，先移除栈中所有≤`t`的下标（这些下标比当前温度矮 / 相等，不可能是答案）；
  3. 栈顶就是当前下标 `i` 的 “下一个更高温度下标”，直接计算答案；
  4. 当前下标入栈，作为左侧元素的候选答案

- 也可以从左向右遍历，栈的作用是存储尚未找到下一个更高温度的下标（相当于 “欠债的人”）

- 这相当于栈是一个 todolist，在循环的过程中，现在还不知道答案是多少，在后面的循环中会算出答案，遍历过程如下：
  1. 遇到当前温度 `t`，检查栈中是否有 “欠答案” 的下标，且其温度 < 当前温度；
  2. 若有，就为这些下标 “结算答案”（`i - j`），并弹出栈；
  3. 当前下标入栈，等待后续更高温度来 “还债”；
  4. 最终未被结算的下标（栈中剩余元素），`ans` 保持默认值 `0`（无更高温度）

- 以山峰比喻
  - 从左到右登山，栈中是 “还没看到更高山峰的位置”
  - 当遇到一座更高的山峰 `i`，它能 “回答” 栈中所有比它矮的山峰：“你们的下一个更高山峰就是我”
  - 这些矮山峰拿到答案后就 “消失”（出栈），当前山峰入栈等待自己的答案

  ```cpp
  class Solution {
  public:
      vector<int> dailyTemperatures(vector<int>& temperatures) {
          int n = temperatures.size();
          vector<int> ans(n);
          stack<int> st; // todolist
          for (int i = 0; i < n; i++) {
              int t = temperatures[i];
              while (!st.empty() && t > temperatures[st.top()]) {
                  int j = st.top();
                  st.pop();
                  ans[j] = i - j;
              }
              st.push(i);
          }
          return ans;
      }
  };
  ```

- 参考题目
  - [739. 每日温度](https://leetcode.cn/problems/daily-temperatures/)
  - [496. 下一个更大元素 I](https://leetcode.cn/problems/next-greater-element-i/)
  - [503. 下一个更大元素 II](https://leetcode.cn/problems/next-greater-element-ii/)
  - [556. 下一个更大元素 III](https://leetcode.cn/problems/next-greater-element-iii/)
  - [2454. 下一个更大元素 IV](https://leetcode.cn/problems/next-greater-element-iv/description/)
  - [901. 股票价格跨度](https://leetcode.cn/problems/online-stock-span/description/)

### 商品折扣后的最终价格

- 题目：[1475. 商品折扣后的最终价格](https://leetcode.cn/problems/final-prices-with-a-special-discount-in-a-shop/description/)

- 给你一个数组 `prices` ，其中 `prices[i]` 是商店里第 `i` 件商品的价格

- 商店里正在进行促销活动，如果你要买第 `i` 件商品，那么你可以得到与 `prices[j]` 相等的折扣，其中 `j` 是满足 `j > i` 且 `prices[j] <= prices[i]` 的 最小下标 ，如果没有满足条件的 `j` ，你将没有任何折扣

- 请你返回一个数组，数组中第 `i` 个元素是折扣后你购买商品 `i` 最终需要支付的价格

- 代码实现

  ```cpp
  class Solution {
  public:
      vector<int> finalPrices(vector<int>& prices) {
          int n = prices.size();
          vector<int> ans(n);
          stack<int> st;
          for (int i = n - 1; i >= 0; i--) {
              int t = prices[i];
              while (!st.empty() && t < prices[st.top()]) {
                  st.pop();
              }
              if (!st.empty()) {
                  ans[i] = t - prices[st.top()];
              } else {
                  ans[i] = t;
              }
              st.push(i);
          }
          return ans;
      }
  };
  ```

### 下一个更大元素 I

- 给你两个没有重复元素的数组 nums1 和 nums2 ，其中nums1 是 nums2 的子集

- 请找出 nums1 中每个元素在 nums2 中的下一个比其大的值

- nums1 中数字 x 的下一个更大元素是指 x 在 nums2 中对应位置的右边的第一个比 x 大的元素。如果不存在，对应位置输出 -1

- 示例 1：
  - 输入：nums1 = [4,1,2], nums2 = [1,3,4,2]
  - 输出：[-1,3,-1]
  - 对于 num1 中的数字 4 ，你无法在第二个数组中找到下一个更大的数字，因此输出 -1
  - 对于 num1 中的数字 1 ，第二个数组中数字1右边的下一个较大数字是 3
  - 对于 num1 中的数字 2 ，第二个数组中没有下一个更大的数字，因此输出 -1

- 提示：
  - 1 \<= nums1.length \<= nums2.length \<= 1000
  - 0 \<= nums1[i], nums2[i] \<= 10^4
  - nums1和nums2中所有整数 互不相同
  - nums1 中的所有整数同样出现在 nums2 中

- 思路
  - 可以先计算 nums2 的下一个最大元素数组

  - 然后遍历 nums1 和 nums2 查找对应相等元素

- 代码实现

  ```cpp
  class Solution {
  public:
      vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
          int m = nums1.size(), n = nums2.size();
          vector<int> next(n, -1);
          vector<int> ans(m, -1);
          stack<int> st;
          for (int i = n - 1; i >= 0; i--) {
              int t = nums2[i];
              while (!st.empty() && t >= nums2[st.top()]) {
                  st.pop();
              }
              if (!st.empty()) {
                  next[i] = nums2[st.top()];
              }
              st.push(i);
          }
          for (int i = 0; i < m; i++) {
              for (int j = 0; j < n; j++) {
                  if (nums1[i] == nums2[j]) {
                      ans[i] = next[j];
                  }
              }
          }
          return ans;
      }
  };
  ```

- 可以先存储 nums1 中元素对应的下标，这样当计算 nums2 的下一个更大元素时，能够直接使用该下标更新元素

  ```cpp
  class Solution {
  public:
      vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
          int m = nums1.size(), n = nums2.size();
          vector<int> ans(m, -1);
          stack<int> st;
          unordered_map<int, int> idx;
          for (int i = 0; i < m; i++) {
              idx[nums1[i]] = i;
          }
          for (int i = n - 1; i >= 0; i--) {
              int t = nums2[i];
              while (!st.empty() && t >= nums2[st.top()]) {
                  st.pop();
              }
              if (!st.empty() && idx.count(t) > 0) {
                  ans[idx[t]] = nums2[st.top()];
              }
              st.push(i);
          }
          return ans;
      }
  };
  ```

### 下一个更大元素 II

- 给定一个循环数组（最后一个元素的下一个元素是数组的第一个元素），输出每个元素的下一个更大元素

- 数字 x 的下一个更大的元素是按数组遍历顺序，这个数字之后的第一个比它更大的数，这意味着应该循环地搜索它的下一个更大的数。如果不存在，则输出 -1

- 示例 1：
  - 输入: [1,2,1]
  - 输出: [2,-1,2]
  - 解释: 第一个 1 的下一个更大的数是 2；数字 2 找不到下一个更大的数；第二个 1 的下一个最大的数需要循环搜索，结果也是 2

- 提示
  - 1 \<= nums.length \<= 10^4
  - -10^9 \<= nums[i] \<= 10^9

- 可以不用扩充 nums，在遍历的过程中模拟走了两遍 nums 即可

- 示例代码

  ```cpp
  class Solution {
  public:
      vector<int> nextGreaterElements(vector<int>& nums) {
          int n = nums.size();
          vector<int> ans(n, -1);
          stack<int> st;
          for (int i = 2 * n - 1; i >= 0; i--) {
              int t = nums[i % n];
              while (!st.empty() && t >= nums[st.top() % n]) {
                  st.pop();
              }
              if (!st.empty()) {
                  ans[i % n] = nums[st.top() % n];
              }
              st.push(i);
          }
          return ans;
      }
  };
  ```

- 从左到右遍历版本

  ```cpp
  class Solution {
  public:
      vector<int> nextGreaterElements(vector<int>& nums) {
          int n = nums.size();
          vector<int> ans(n, -1);
          stack<int> st;
          for (int i = 0; i < 2 * n; i++) {
              int x = nums[i % n];
              while (!st.empty() && x > nums[st.top()]) {
                  // x 是 nums[st.top()] 的下一个更大元素
                  // 既然 nums[st.top()] 已经算出答案，则从栈顶弹出
                  ans[st.top()] = x;
                  st.pop();
              }
              if (i < n) {
                  st.push(i);
              }
          }
          return ans;
      }
  };
  ```

### 下一个更大元素 IV

- 求元素的下下个更大元素

- 可能会想，就是求下一个更大元素的下一个更大元素，但是这是不对的，例如对于 [2,4,0,9,6]，4 的下下个更大元素是 6，而不是 9 的下一个更大元素

- 如何求下下个更大元素？使用两个单调栈，当求得一个元素的下一个更大元素时，需要将其移入第二个单调栈，以使得能够再求该元素的下下个更大值
  - `stack1` 存储未找到下一个更大值的元素下标（核心：找第一个更大值）
  - `stack2` 存储已找到下一个更大值、但未找到下下个更大值的元素下标（核心：找第二个更大值）

  ```cpp
  class Solution {
  public:
      vector<int> secondGreaterElement(vector<int>& nums) {
          int n = nums.size();
          stack<int> s1, s2;      // 双单调递减栈
          vector<int> res(n, -1); // 初始化结果为-1

          // 正向遍历每个元素（i是当前元素下标，作为“更大值候选”）
          for (int i = 0; i < n; ++i) {
              // 步骤1：处理s2 → 找下下个更大值
              // 若当前元素 > s2栈顶元素的值 → s2栈顶找到下下个更大值
              while (!s2.empty() && nums[s2.top()] < nums[i]) {
                  int t = s2.top();
                  s2.pop();
                  res[t] = nums[i]; // 记录结果
              }

              // 步骤2：处理s1 → 找下一个更大值，临时栈tmp保存弹出的元素
              stack<int> tmp;
              while (!s1.empty() && nums[s1.top()] < nums[i]) {
                  int t = s1.top();
                  s1.pop();
                  tmp.push(t); // 弹出s1中所有<当前值的元素，存入tmp
              }

              // 步骤3：将tmp中的元素移入s2（恢复原顺序，保证s2单调递减）
              while (!tmp.empty()) {
                  s2.push(tmp.top());
                  tmp.pop();
              }

              // 步骤4：当前元素压入s1，等待找它的下一个更大值
              s1.push(i);
          }
          return res;
      }
  };
  ```

### 股票价格跨度

- 题目：[901. 股票价格跨度](https://leetcode.cn/problems/online-stock-span/)

- 维护一个单调递减栈（从栈底至栈顶），这样当前股票的跨度就是当前的索引减去栈顶的索引

- 代码实现

  ```cpp
  class StockSpanner {
  public:
      stack<int> st;
      vector<int> prices;
      StockSpanner() {}

      int next(int price) {
          prices.push_back(price);
          while (!st.empty() && prices[st.top()] <= price) {
              st.pop();
          }
          int cur = prices.size() - 1;
          int stride = cur - (st.empty() ? -1 : st.top());
          st.push(cur);
          return stride;
      }
  };

  /**
   * Your StockSpanner object will be instantiated and called as such:
   * StockSpanner* obj = new StockSpanner();
   * int param_1 = obj->next(price);
   */
  ```

### 132 模式

- 题目：[456. 132 模式](https://leetcode.cn/problems/132-pattern/description/)

- 存在下标 `i < j < k`，满足 `nums[i] < nums[k] < nums[j]`，其中：
  - 1 值：`nums[i]`（最小，左侧）
  - 3 值：`nums[j]`（最大，中间）
  - 2 值：`nums[k]`（中间，右侧）

- 直接枚举 ijk 很容易超时，可以枚举一个值，然后用合适的数据结构来枚举另外两个值

- 以 `j`（3 值）为核心，分别维护
  - 左侧最小值：`left_min`（即 1 值的最优候选，`i < j` 且 `nums[i]` 最小，最大化找到 `nums[k] > left_min` 的可能）
  - 右侧有序集合：用 `multiset` 存储 `j` 右侧所有元素（即 k 的候选），快速查找是否存在 `left_min < nums[k] < nums[j]`
  - 这种方法需要提前知道整个数组，否则无法使用有序集合维护右侧元素

  ```cpp
  class Solution {
  public:
      bool find132pattern(vector<int>& nums) {
          int n = nums.size();
          if (n < 3) return false;

          // 1. 初始化：左侧最小值（初始为第一个元素）
          int left_min = nums[0];
          // 2. 初始化：右侧所有元素（j从1开始，初始存储j+1到n-1的元素）
          multiset<int> right_all;
          for (int k = 2; k < n; ++k) {
              right_all.insert(nums[k]);
          }

          // 3. 枚举每个j（3值）
          for (int j = 1; j < n - 1; ++j) {
              // 先判断：左侧存在1值（left_min < 3值）
              if (left_min < nums[j]) {
                  // 查找右侧第一个大于left_min的元素（满足1 < 2）
                  auto it = right_all.upper_bound(left_min);
                  // 若该元素存在且小于3值（满足2 < 3），则找到132模式
                  if (it != right_all.end() && *it < nums[j]) {
                      return true;
                  }
              }
              // 更新左侧最小值（j右移，左侧包含当前j）
              left_min = min(left_min, nums[j]);
              // 移除右侧集合中j+1的元素（j右移后，j+1不再属于右侧）
              right_all.erase(right_all.find(nums[j + 1]));
          }

          return false;
      }
  };
  ```

- 从后往前枚举 3 值（j），用单调栈找 2 值（k），用前缀最小值找 1 值（i）
  - 前缀最小值数组 `leftMin`：`leftMin[j]` 表示 `j` 左侧所有元素的最小值（即 132 中的 1 值 `nums[i]`，`i < j`）
  - 单调栈：从后往前遍历 `j`（3 值），栈中维护 `j` 右侧的元素（k 候选），弹出所有小于 `nums[j]` 的元素，最后一个弹出的元素即为最大的 2 值（`numsk`）
  - 判断条件：若 `leftMin[j] < numsk`，说明存在 `i < j < k` 满足 `nums[i] < nums[k] < nums[j]`，即找到 132 模式

  ```cpp
  class Solution {
  public:
      bool find132pattern(vector<int>& nums) {
          int n = nums.size();
          if (n < 3) {
              return false;
          }

          // 步骤1：预处理左侧最小值数组（对应Python的leftMin）
          vector<int> leftMin(n, INT_MAX);  // C++用INT_MAX替代float("inf")
          for (int i = 1; i < n; ++i) {
              leftMin[i] = min(leftMin[i - 1], nums[i - 1]);
          }

          // 步骤2：单调栈从后往前遍历找2值（numsk）
          stack<int> stk;
          for (int j = n - 1; j >= 0; --j) {
              int numsk = INT_MIN;  // C++用INT_MIN替代float("-inf")
              // 弹出栈中所有小于nums[j]的元素，记录最大的有效2值
              while (!stk.empty() && stk.top() < nums[j]) {
                  numsk = stk.top();
                  stk.pop();
              }
              // 核心判断：1值 < 2值 → 找到132模式
              if (leftMin[j] < numsk) {
                  return true;
              }
              // 将当前元素压入栈，作为后续j'的2值候选
              stk.push(nums[j]);
          }

          return false;
      }
  };
  ```

- 从后往前枚举 `i`（1 值），用单调栈维护 3 值和 2 值的候选
  - `max_k`：记录当前最大的 2 值（`nums[k]`），最大化找到 `nums[i] < max_k` 的可能
  - 单调栈：存储 3 值的候选（`nums[j]`），保持栈内元素递减
  - 遍历到 `nums[i]` 时，若 `nums[i] < max_k`，说明存在 2 值，且 2 值 < 3 值（栈内元素），即找到 132 模式
  - 这个方法需要从后向前遍历，本质上也需要提前知道整个数组

  ```cpp
  class Solution {
  public:
      bool find132pattern(vector<int>& nums) {
          int n = nums.size();
          if (n < 3) return false;

          stack<int> candidate_k; // 单调递减栈，存储3值候选（nums[j]）
          candidate_k.push(nums[n - 1]);
          int max_k = INT_MIN; // 记录最大的2值（nums[k]）

          // 从后往前枚举1值（i）
          for (int i = n - 2; i >= 0; --i) {
              // 1值 < 最大的2值 → 找到132模式
              if (nums[i] < max_k) {
                  return true;
              }
              // 若当前元素 > 栈顶（3值候选），则栈顶可作为2值，更新max_k
              while (!candidate_k.empty() && nums[i] > candidate_k.top()) {
                  max_k = candidate_k.top();
                  candidate_k.pop();
              }
              // 若当前元素 > max_k，压入栈作为3值候选
              if (nums[i] > max_k) {
                  candidate_k.push(nums[i]);
              }
          }

          return false;
      }
  };
  ```

- 以 `k`（2 值）为核心，分别维护
  - 左侧最大值：用单调栈维护 `j < k` 的 3 值候选（`nums[j]`），要求 `nums[j] > nums[k]`
  - 前缀最小值：预处理 `prefix_min` 数组，`prefix_min[k]` 表示 `i < k` 的最小 1 值（`nums[i]`）
  - 遍历每个 `k`，先从栈中弹出 ≤ `nums[k]` 的元素（不满足 3 > 2），剩余栈顶若存在，且 `prefix_min[k] < nums[k]`，则找到 132 模式

  ```cpp
  class Solution {
  public:
      bool find132pattern(vector<int>& nums) {
          int n = nums.size();
          if (n < 3) return false;

          // 1. 预处理前缀最小值（i < k 的最小1值）
          vector<int> prefix_min(n);
          prefix_min[0] = nums[0];
          for (int i = 1; i < n; ++i) {
              prefix_min[i] = min(prefix_min[i - 1], nums[i]);
          }

          // 2. 单调栈维护j < k 的3值候选（nums[j] > nums[k]）
          stack<int> candidate_j; // 单调递减栈

          // 枚举2值（k），从后往前遍历
          for (int k = n - 1; k >= 0; --k) {
              int num2 = nums[k];
              int num1 = prefix_min[k];

              // 弹出栈中≤num2的元素（不满足3 > 2）
              while (!candidate_j.empty() && candidate_j.top() <= num2) {
                  candidate_j.pop();
              }

              // 栈顶存在（3值），且1值 < 2值 → 找到132模式
              if (!candidate_j.empty() && num1 < num2) {
                  return true;
              }

              // 压入当前元素作为3值候选
              candidate_j.push(num2);
          }

          return false;
      }
  };
  ```

- 双数组对

  ```cpp
  bool find132pattern(vector<int>& nums) {
      int n = nums.size();
      if (n < 3) return false;

      vector<int> candidate_i = {nums[0]}, candidate_j = {nums[0]};
      for (int k = 1; k < n; ++k) {
          // 二分找满足1<nums[k]的i，和满足3>nums[k]的j
          auto it_i = upper_bound(candidate_i.begin(), candidate_i.end(), nums[k], greater<int>());
          auto it_j = lower_bound(candidate_j.begin(), candidate_j.end(), nums[k], greater<int>());
          if (it_i != candidate_i.end() && it_j != candidate_j.begin()) {
              int idx_i = it_i - candidate_i.begin();
              int idx_j = it_j - candidate_j.begin() - 1;
              if (idx_i <= idx_j) return true;
          }
          // 维护(i,j)候选对的递减性
          if (nums[k] < candidate_i.back()) {
              candidate_i.push_back(nums[k]);
              candidate_j.push_back(nums[k]);
          } else if (nums[k] > candidate_j.back()) {
              int last_i = candidate_i.back();
              while (!candidate_j.empty() && nums[k] > candidate_j.back()) {
                  candidate_i.pop_back();
                  candidate_j.pop_back();
              }
              candidate_i.push_back(last_i);
              candidate_j.push_back(nums[k]);
          }
      }
      return false;
  }
  ```

- 那么如何统计 132 模式的子序列个数？

- 枚举 j + 有序集合（O (n² log n)，易理解）
  - 对每个 j（3 值），先预处理：
    - 左侧：用数组记录每个 j 左侧的所有元素；
    - 右侧：用 `multiset` 存储 j 右侧的所有元素（有序，方便二分查找）
  - 对每个 j，遍历左侧所有 i（满足 `nums[i] < nums[j]`），在右侧找满足 `nums[i] < nums[k] < nums[j]` 的 k 数量，累加总数

  ```cpp
  class Solution {
  public:
      long long count132Pattern(vector<int>& nums) {
          int n = nums.size();
          if (n < 3) return 0;

          long long total = 0; // 用long long避免溢出
          // 初始化右侧有序集合（存储j右侧的所有元素）
          multiset<int> right_all;
          for (int k = 2; k < n; ++k) {
              right_all.insert(nums[k]);
          }

          // 枚举每个j（3值），j的范围是[1, n-2]
          for (int j = 1; j < n - 1; ++j) {
              int numj = nums[j];
              // 步骤1：遍历j左侧所有i（i < j），找满足nums[i] < numj的i
              for (int i = 0; i < j; ++i) {
                  int numi = nums[i];
                  if (numi >= numj) continue; // 不满足1 < 3，跳过

                  // 步骤2：在右侧找满足 numi < nums[k] < numj 的k数量
                  // lower_bound找第一个>numi的元素，upper_bound找第一个>=numj的元素
                  auto left_it = right_all.upper_bound(numi);    // > numi
                  auto right_it = right_all.lower_bound(numj);   // >= numj
                  // 两个迭代器之间的元素个数就是当前i对应的有效k数
                  total += distance(left_it, right_it);
              }

              // j右移，移除右侧集合中j+1位置的元素（因为j+1不再属于j的右侧）
              right_all.erase(right_all.find(nums[j + 1]));
          }

          return total;
      }
  };
  ```

- 枚举 j + 前缀计数 + 树状数组（O (n log n)，高效）
  - 用树状数组（Fenwick Tree） 优化左侧 / 右侧的计数逻辑，将时间复杂度降到 O (n log n)
  - 离散化：将数组值映射到连续区间（树状数组需要）
  - 对每个 j
    - 左侧：用树状数组统计「\<x」的元素个数（x 是 nums [k]）
    - 右侧：预处理后缀树状数组，统计「> nums [i] 且 \< nums [j]」的元素个数
  - 累加所有 j 的有效三元组数量

  ```cpp
  // 树状数组模板
  class FenwickTree {
  private:
      vector<int> tree;
  public:
      FenwickTree(int size) : tree(size + 1, 0) {}

      void update(int idx, int delta) {
          for (; idx < tree.size(); idx += idx & -idx) {
              tree[idx] += delta;
          }
      }

      int query(int idx) {
          int res = 0;
          for (; idx > 0; idx -= idx & -idx) {
              res += tree[idx];
          }
          return res;
      }
  };

  class Solution {
  public:
      long long count132Pattern(vector<int>& nums) {
          int n = nums.size();
          if (n < 3) return 0;

          // 步骤1：离散化（将数值映射到1~m的连续区间）
          set<int> unique_nums(nums.begin(), nums.end());
          vector<int> sorted_nums(unique_nums.begin(), unique_nums.end());
          int m = sorted_nums.size();
          auto get_idx = [&](int x) {
              return lower_bound(sorted_nums.begin(), sorted_nums.end(), x) - sorted_nums.begin() + 1;
          };

          // 步骤2：预处理后缀树状数组（存储j右侧的元素）
          FenwickTree suffix_tree(m);
          for (int k = 2; k < n; ++k) {
              suffix_tree.update(get_idx(nums[k]), 1);
          }

          // 步骤3：前缀树状数组（存储j左侧的元素）
          FenwickTree prefix_tree(m);
          prefix_tree.update(get_idx(nums[0]), 1);

          long long total = 0;

          // 枚举每个j（3值）
          for (int j = 1; j < n - 1; ++j) {
              int numj = nums[j];
              int idx_j = get_idx(numj);

              // 步骤4：统计左侧满足 nums[i] < numj 的i数量，且对每个i，统计右侧满足 nums[i]<nums[k]<numj 的k数量
              // 遍历左侧所有可能的numi（优化：直接通过树状数组计算区间和）
              // 核心：对当前j，有效三元组数量 = sum( 左侧numi < x 的数量 × 右侧x < numj 且 x > numi 的数量 )
              // 转换为：遍历所有可能的x（numk），满足x < numj，计算 左侧<x 的数量 × 右侧=x 的数量
              for (int x_idx = 1; x_idx < idx_j; ++x_idx) {
                  int x = sorted_nums[x_idx - 1];
                  // 左侧<x的i数量
                  int left_cnt = prefix_tree.query(x_idx - 1);
                  if (left_cnt == 0) continue;
                  // 右侧=x的k数量
                  int right_cnt = suffix_tree.query(x_idx) - suffix_tree.query(x_idx - 1);
                  total += (long long)left_cnt * right_cnt;
              }

              // 更新前缀树（j左侧加入当前nums[j]，供下一个j使用）
              prefix_tree.update(get_idx(numj), 1);
              // 更新后缀树（移除j+1位置的元素）
              suffix_tree.update(get_idx(nums[j + 1]), -1);
          }

          return total;
      }
  };
  ```

### 车队

- 题目：[853. 车队](https://leetcode.cn/problems/car-fleet/description/)

- 在一条单行道上，有 `n` 辆车开往同一目的地。目的地是几英里以外的 `target`

- 给定两个整数数组 `position` 和 `speed` ，长度都是 `n` ，其中 `position[i]` 是第 `i` 辆车的位置， `speed[i]` 是第 `i` 辆车的速度(单位是英里/小时)

- 一辆车永远不会超过前面的另一辆车，但它可以追上去，并以较慢车的速度在另一辆车旁边行驶

- 车队是指并排行驶的一辆或几辆汽车。车队的速度是车队中最慢的车的速度

- 即便一辆车在 `target` 才赶上了一个车队，它们仍然会被视作是同一个车队

- 返回到达目的地的车队数量

- 分析
  - 将每辆车的位置和速度配对，并按位置从大到小排序（离终点越近的车排越前）
  - 计算每辆车单独到达终点的时间：`time = (target - position) / speed`
  - 遍历排序后的车辆，维护一个当前最慢的到达时间（即当前车队的到达时间）：
    - 如果当前车辆的到达时间 > 当前最慢时间 → 形成新车队
    - 如果当前车辆的到达时间 ≤ 当前最慢时间 → 会追上前面的车队，合并

- 代码实现

  ```cpp
  int carFleet(int target, vector<int>& position, vector<int>& speed) {
      // 1. 配对位置和速度，并按位置降序排序
      vector<pair<int, int>> cars;
      int n = position.size();
      for (int i = 0; i < n; ++i) {
          cars.emplace_back(position[i], speed[i]);
      }

      // 按位置从大到小排序（离终点近的在前）
      sort(cars.begin(), cars.end(), [](const pair<int, int>& a, const pair<int, int>& b) {
          return a.first > b.first;
      });

      int fleet_count = 0;
      double current_max_time = 0.0;  // 记录当前最慢的到达时间

      // 2. 遍历每辆车，计算到达时间并判断车队数量
      for (const auto& car : cars) {
          int pos = car.first;
          int spd = car.second;

          // 计算当前车辆单独到达终点的时间（注意用浮点数避免整数除法）
          double time_to_target = static_cast<double>(target - pos) / spd;

          // 如果当前车辆的到达时间大于当前最慢时间，形成新车队
          if (time_to_target > current_max_time) {
              fleet_count++;
              current_max_time = time_to_target;
          }
      }

      return fleet_count;
  }
  ```

- 也可以维护一个单调递增栈（栈中存储的是车辆到达终点的时间，且栈内元素从栈底到栈顶递增），栈的最终大小就是车队数量
  1. 预处理：将车辆按位置从大到小排序（离终点越近越靠前）
  2. 栈操作规则：
     - 计算当前车辆的到达时间 `time`；
     - 如果栈不为空，且当前 `time <= 栈顶元素` → 说明当前车（离终点更近）速度更快 / 到达时间更短，后车（离终点更远）会被它挡住，当前车无法形成独立车队，不压入栈；
     - 如果当前 `time > 栈顶元素` → 说明当前车是新的独立车队，压入栈；

  3. 结果：栈中剩余的元素数量就是最终的车队数

- 代码实现

  ```cpp
  int carFleet(int target, vector<int>& position, vector<int>& speed) {
      // 1. 配对位置和速度，按位置降序排序（离终点近的在前）
      vector<pair<int, int>> cars;
      int n = position.size();
      for (int i = 0; i < n; ++i) {
          cars.emplace_back(position[i], speed[i]);
      }
      // 按位置降序排序
      sort(cars.begin(), cars.end(), [](const pair<int, int>& a, const pair<int, int>& b) {
          return a.first > b.first;
      });

      // 2. 初始化单调栈（存储到达时间，保持栈内元素递增）
      stack<double> stk;

      // 3. 遍历每辆车，处理栈
      for (const auto& car : cars) {
          int pos = car.first;
          int spd = car.second;
          double time = static_cast<double>(target - pos) / spd;

          // 核心逻辑：如果当前时间 <= 栈顶，说明会被前面的车队挡住，不压入栈
          // 只有当前时间 > 栈顶，才是新的独立车队，压入栈
          if (stk.empty() || time > stk.top()) {
              stk.push(time);
          }
          // 否则（time <= 栈顶）：当前车会合并到前面的车队，不处理
      }

      // 栈的大小就是车队数量
      return stk.size();
  }
  ```

### 接雨水

- 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水

- 当前列雨水面积：min(左边柱子的最高高度，记录右边柱子的最高高度) - 当前柱子高度

- 双指针法暴力求解

  ```cpp
  class Solution {
  public:
      int trap(vector<int>& height) {
          int sum = 0;
          for (int i = 0; i < height.size(); i++) {
              // 第一个柱子和最后一个柱子不接雨水
              if (i == 0 || i == height.size() - 1) continue;

              int rHeight = height[i]; // 记录右边柱子的最高高度
              int lHeight = height[i]; // 记录左边柱子的最高高度
              for (int r = i + 1; r < height.size(); r++) {
                  if (height[r] > rHeight) rHeight = height[r];
              }
              for (int l = i - 1; l >= 0; l--) {
                  if (height[l] > lHeight) lHeight = height[l];
              }
              int h = min(lHeight, rHeight) - height[i];
              if (h > 0) sum += h;
          }
          return sum;
      }
  };
  ```

- 每次遍历列的时候，还要向两边寻找最高的列，所以时间复杂度为 $O(n^2)$，空间复杂度为 $O(1)$

- 实际上，暴力解法存在重复的计算，可以通过数组来记录左边最高高度和右边最高高度

  ```cpp
  class Solution {
  public:
      int trap(vector<int>& height) {
          if (height.size() <= 2) return 0;
          vector<int> maxLeft(height.size(), 0);
          vector<int> maxRight(height.size(), 0);
          int size = maxRight.size();

          // 记录每个柱子左边柱子最大高度
          maxLeft[0] = height[0];
          for (int i = 1; i < size; i++) {
              maxLeft[i] = max(height[i], maxLeft[i - 1]);
          }
          // 记录每个柱子右边柱子最大高度
          maxRight[size - 1] = height[size - 1];
          for (int i = size - 2; i >= 0; i--) {
              maxRight[i] = max(height[i], maxRight[i + 1]);
          }
          // 求和
          int sum = 0;
          for (int i = 0; i < size; i++) {
              int count = min(maxLeft[i], maxRight[i]) - height[i];
              if (count > 0) sum += count;
          }
          return sum;
      }
  };
  ```

- 单调栈法按照行方向来计算雨水，从栈顶到栈底的顺序是从小到大的，因为一旦发现当前的柱子高度大于栈顶元素，此时就会出现凹槽，栈顶元素便是凹槽底部的柱子，栈顶第二个元素就是凹槽左边的柱子，添加的元素就是凹槽右边的柱子

- 代码实现

  ```cpp
  class Solution {
  public:
      int trap(vector<int>& height) {
          if (height.size() <= 2) return 0; // 可以不加
          stack<int> st; // 存着下标，计算的时候用下标对应的柱子高度
          st.push(0);
          int sum = 0;
          for (int i = 1; i < height.size(); i++) {
              if (height[i] < height[st.top()]) {     // 情况一
                  st.push(i);
              } if (height[i] == height[st.top()]) {  // 情况二
                  st.pop(); // 其实这一句可以不加，效果是一样的，但处理相同的情况的思路却变了。
                  st.push(i);
              } else {                                // 情况三
                  while (!st.empty() && height[i] > height[st.top()]) { // 注意这里是while
                      int mid = st.top();
                      st.pop();
                      if (!st.empty()) {
                          int h = min(height[st.top()], height[i]) - height[mid];
                          int w = i - st.top() - 1; // 注意减一，只求中间宽度
                          sum += h * w;
                      }
                  }
                  st.push(i);
              }
          }
          return sum;
      }
  };
  ```

- 参考题目
  - [42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/description/)
  - [407. 接雨水 II](https://leetcode.cn/problems/trapping-rain-water-ii/)
  - [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)
  - [238. 除了自身以外数组的乘积](https://leetcode.cn/problems/product-of-array-except-self/)
  - [2873. 有序三元组中的最大值 I](https://leetcode.cn/problems/maximum-value-of-an-ordered-triplet-i/description/)
  - [2874. 有序三元组中的最大值 II](https://leetcode.cn/problems/maximum-value-of-an-ordered-triplet-ii/)
  - [2908. 元素和最小的山形三元组 I](https://leetcode.cn/problems/minimum-sum-of-mountain-triplets-i/description/)
  - [2909. 元素和最小的山形三元组 II](https://leetcode.cn/problems/minimum-sum-of-mountain-triplets-ii/description/)
  - [2012. 数组美丽值求和](https://leetcode.cn/problems/sum-of-beauty-in-the-array/description/)
  - [121. 买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/description/)

### 柱状图中的最大矩形

- 给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1

- 求在该柱状图中，能够勾勒出来的矩形的最大面积

- 对于每个柱子 `heights[i]`，能构成的最大矩形的宽度 = 「右侧第一个更矮柱子的下标 - 左侧第一个更矮柱子的下标 - 1」，面积 = 高度 × 宽度；这是因为要保持左右两侧柱子不比当前柱子底，否则就无法向左右延伸，一旦遇到比 `heights[i]` 矮的柱子，就无法再延伸（再延伸的话矩形高度就不能保持 `heights[i]` 了）

- 暴力解法

  ```cpp
  class Solution {
  public:
      int largestRectangleArea(vector<int>& heights) {
          int sum = 0;
          for (int i = 0; i < heights.size(); i++) {
              int left = i;
              int right = i;
              for (; left >= 0; left--) {
                  if (heights[left] < heights[i]) break;
              }
              for (; right < heights.size(); right++) {
                  if (heights[right] < heights[i]) break;
              }
              int w = right - left - 1;
              int h = heights[i];
              sum = max(sum, w * h);
          }
          return sum;
      }
  };
  ```

- 可以三次遍历，第一次遍历获得左侧第一个更矮的柱子，第二次遍历获得右侧第一个更矮的柱子，第三次计算答案

  ```cpp
  class Solution {
  public:
      int largestRectangleArea(vector<int> &heights) {
          int n = heights.size();
          vector<int> left(n, -1);
          stack<int> st;
          for (int i = 0; i < n; i++) {
              int h = heights[i];
              while (!st.empty() && heights[st.top()] >= h) {
                  st.pop();
              }
              if (!st.empty()) {
                  left[i] = st.top();
              }
              st.push(i);
          }

          vector<int> right(n, n);
          st = stack<int>();
          for (int i = n - 1; i >= 0; i--) {
              int h = heights[i];
              while (!st.empty() && heights[st.top()] >= h) {
                  st.pop();
              }
              if (!st.empty()) {
                  right[i] = st.top();
              }
              st.push(i);
          }

          int ans = 0;
          for (int i = 0; i < n; i++) {
              ans = max(ans, heights[i] * (right[i] - left[i] - 1));
          }
          return ans;
      }
  };
  ```

- 将右侧第一个更矮的柱子更改为第一个不比当前柱子更高的柱子，这样，在从左往右遍历计算左侧第一个更矮的柱子时，就能够标记栈顶的下一个非更高的柱子

- 这种做法会影响重复高度的柱子吗？例如对于 [1,3,4,3,2]，左侧的 3 的最大面积可能会变小，但是右边的 3 的最大面积是正确的

  ```cpp
  class Solution {
  public:
      int largestRectangleArea(vector<int> &heights) {
          int n = heights.size();
          vector<int> left(n, -1);
          vector<int> right(n, n);
          stack<int> st;
          for (int i = 0; i < n; i++) {
              int h = heights[i];
              while (!st.empty() && heights[st.top()] >= h) {
                  right[st.top()] = i;
                  st.pop();
              }
              if (!st.empty()) {
                  left[i] = st.top();
              }
              st.push(i);
          }

          int ans = 0;
          for (int i = 0; i < n; i++) {
              ans = max(ans, heights[i] * (right[i] - left[i] - 1));
          }
          return ans;
      }
  };
  ```

- 另一种两次遍历的写法，先确定一个方向的更小值，然后在计算另一个方向的时候就更新答案

  ```cpp
  class Solution {
  public:
      int largestRectangleArea(vector<int>& heights) {
          int n = heights.size();
          vector<int> right(n, n);
          stack<int> st;
          for (int i = n - 1; i >= 0; i--) {
              while (!st.empty() && heights[st.top()] >= heights[i]) {
                  st.pop();
              }
              if (!st.empty()) {
                  right[i] = st.top();
              }
              st.push(i);
          }
          while (!st.empty()) {
              st.pop();
          }
          int ans = 0;
          for (int i = 0; i < n; i++) {
              while (!st.empty() && heights[st.top()] >= heights[i]) {
                  st.pop();
              }
              if (!st.empty()) {
                  ans = max(ans, (right[i] - st.top() - 1) * heights[i]);
              } else {
                  ans = max(ans, right[i] * heights[i]);
              }
              st.push(i);
          }
          return ans;
      }
  };
  ```

- 为了不用处理栈是否为空的边界条件，可以也声明一个 left 数组

- 仿照这个思路，由于单调栈是底小顶大的，栈顶下面那个柱子的高度一定比栈顶小，所以栈顶下面的值就是左侧第一个更矮的柱子

  ```cpp
  class Solution {
  public:
      int largestRectangleArea(vector<int>& heights) {
          heights.push_back(-1); // 最后大火收汁，用 -1 把栈清空
          stack<int> st;
          st.push(-1); // 在栈中只有一个数的时候，栈顶的「下面那个数」是 -1，对应 left[i] = -1 的情况
          int ans = 0;
          for (int right = 0; right < heights.size(); right++) {
              int h = heights[right];
              while (st.size() > 1 && heights[st.top()] >= h) {
                  int i = st.top(); // 矩形的高（的下标）
                  st.pop();
                  int left = st.top(); // 栈顶下面那个数就是 left
                  ans = max(ans, heights[i] * (right - left - 1));
              }
              st.push(right);
          }
          return ans;
      }
  };
  ```

- 参考题目
  - [84. 柱状图中最大的矩形](https://leetcode.cn/problems/largest-rectangle-in-histogram/)
  - [85. 最大矩形](https://leetcode.cn/problems/maximal-rectangle/description/)
  - [221. 最大正方形](https://leetcode.cn/problems/maximal-square/)
  - [1793. 好子数组的最大分数](https://leetcode.cn/problems/maximum-score-of-a-good-subarray/description/)
  - [32. 最长有效括号](https://leetcode.cn/problems/longest-valid-parentheses/)

### 最大矩形

- 题目：[85. 最大矩形](https://leetcode.cn/problems/maximal-rectangle/description/)

- 显然，对于 i 行前的矩形，每一列可以看作是一个柱子，用柱状图中的最大矩形来解决

- 代码实现

  ```cpp
  class Solution {
  public:
      int largestRectangleArea(vector<int>& heights) {
          int n = heights.size();
          vector<int> left(n, -1);
          vector<int> right(n, n);
          stack<int> st;
          for (int i = 0; i < n; i++) {
              int h = heights[i];
              while (!st.empty() && heights[st.top()] >= h) {
                  right[st.top()] = i;
                  st.pop();
              }
              if (!st.empty()) {
                  left[i] = st.top();
              }
              st.push(i);
          }

          int ans = 0;
          for (int i = 0; i < n; i++) {
              ans = max(ans, heights[i] * (right[i] - left[i] - 1));
          }
          return ans;
      }
      int maximalRectangle(vector<vector<char>>& matrix) {
          vector<int> heights(matrix[0].size(), 0);
          int ans = 0;
          for (int i = 0; i < matrix.size(); i++) {
              for (int j = 0; j < matrix[i].size(); j++) {
                  if (matrix[i][j] == '0') {
                      heights[j] = 0;
                  } else {
                      heights[j] += 1;
                  }
              }
              ans = max(ans, largestRectangleArea(heights));
          }
          return ans;
      }
  };
  ```

### 最大正方形

- 可以改为计算宽和高的最小值，即为当前的最大正方形边长

  ```cpp
  class Solution {
  public:
      int largestRectangleArea(vector<int>& heights) {
          int n = heights.size();
          vector<int> left(n, -1);
          vector<int> right(n, n);
          stack<int> st;
          for (int i = 0; i < n; i++) {
              int h = heights[i];
              while (!st.empty() && heights[st.top()] >= h) {
                  right[st.top()] = i;
                  st.pop();
              }
              if (!st.empty()) {
                  left[i] = st.top();
              }
              st.push(i);
          }

          int ans = 0;

          for (int i = 0; i < n; i++) {
              int mn = min(heights[i], (right[i] - left[i] - 1));
              ans = max(ans, mn);
          }
          return ans;
      }
      int maximalSquare(vector<vector<char>>& matrix) {
          vector<int> heights(matrix[0].size(), 0);
          int ans = 0;
          for (int i = 0; i < matrix.size(); i++) {
              for (int j = 0; j < matrix[i].size(); j++) {
                  if (matrix[i][j] == '0') {
                      heights[j] = 0;
                  } else {
                      heights[j] += 1;
                  }
              }
              ans = max(ans, largestRectangleArea(heights));
          }
          return ans * ans;
      }
  };
  ```

- 也可以用动态规划来解决
  - 定义 `dp[i][j]` 表示以矩阵中第 `i` 行第 `j` 列的元素为右下角的最大正方形的边长
  - 如果 `matrix[i][j] == '0'`，则 `dp[i][j] = 0`（因为包含 0 无法构成正方形）
  - 如果 `matrix[i][j] == '1'`，则 `dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1`（当前位置能构成的最大正方形边长，由左边、上边、左上角三个位置的最小值 + 1 决定）
  - 第一行和第一列的元素，如果是 '1'，则 `dp[i][j] = 1`（只能构成边长为 1 的正方形）
  - 遍历过程中记录最大边长，最终面积为 `最大边长 * 最大边长`

- 代码实现

  ```cpp
  class Solution {
  public:
      int maximalSquare(vector<vector<char>>& matrix) {
          // 处理空矩阵的边界情况
          if (matrix.empty() || matrix[0].empty()) {
              return 0;
          }

          int rows = matrix.size();
          int cols = matrix[0].size();
          // 初始化dp数组，大小和原矩阵一致，初始值为0
          vector<vector<int>> dp(rows, vector<int>(cols, 0));
          int max_side = 0;  // 记录最大正方形的边长

          // 填充dp数组
          for (int i = 0; i < rows; ++i) {
              for (int j = 0; j < cols; ++j) {
                  // 当前位置是'1'
                  if (matrix[i][j] == '1') {
                      // 边界条件：第一行或第一列
                      if (i == 0 || j == 0) {
                          dp[i][j] = 1;
                      } else {
                          // 状态转移方程：取左、上、左上三个方向的最小值+1
                          dp[i][j] = min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]}) + 1;
                      }
                      // 更新最大边长
                      max_side = max(max_side, dp[i][j]);
                  }
                  // 若matrix[i][j]是'0'，dp[i][j]保持0即可，无需额外处理
              }
          }

          // 返回面积（边长的平方）
          return max_side * max_side;
      }
  };
  ```

- 可以进一步优化空间

  ```cpp
  class Solution {
  public:
      int maximalSquare(vector<vector<char>>& matrix) {
          if (matrix.empty() || matrix[0].empty()) {
              return 0;
          }

          int rows = matrix.size();
          int cols = matrix[0].size();
          vector<int> dp(cols + 1, 0);  // 一维DP数组，多开1位避免边界判断
          int max_side = 0;
          int prev = 0;  // 保存左上角的值（上一轮的dp[j-1]）

          for (int i = 1; i <= rows; ++i) {
              prev = 0;  // 每行开始时重置
              for (int j = 1; j <= cols; ++j) {
                  int temp = dp[j];  // 保存当前dp[j]，作为下一轮的prev
                  if (matrix[i-1][j-1] == '1') {
                      dp[j] = min({dp[j-1], dp[j], prev}) + 1;
                      max_side = max(max_side, dp[j]);
                  } else {
                      dp[j] = 0;  // 当前位置是0，无法构成正方形
                  }
                  prev = temp;
              }
          }

          return max_side * max_side;
      }
  };
  ```

### 全为 1 的子矩形

- 可以枚举矩形的上边界和下边界，例如对于上边界为 0，下边界为 1，只需要枚举高为 h 的列，如果某列高度为 h，说明其与上一个高度为 h 的列之间都可以构成全为 1 的子矩形，否则就要更新上一个高度为 h 的列

- 代码实现

  ```cpp
  class Solution {
  public:
      int numSubmat(vector<vector<int>>& mat) {
          int m = mat.size(), n = mat[0].size();
          int ans = 0;
          for (int top = 0; top < m; top++) { // 枚举上边界
              vector<int> a(n);
              for (int bottom = top; bottom < m; bottom++) { // 枚举下边界
                  int h = bottom - top + 1; // 高
                  // 2348. 全 h 子数组的数目
                  int last = -1;
                  for (int j = 0; j < n; j++) {
                      a[j] += mat[bottom][j]; // 把 bottom 这一行的值加到 a 中
                      if (a[j] != h) {
                          last = j; // 记录上一个非 h 元素的位置
                      } else {
                          ans += j - last;
                      }
                  }
              }
          }
          return ans;
      }
  };
  ```

- 上述算法的时间复杂度为 $O(mn^2)$

- 另一种枚举方法，按行遍历，逐列计算以当前位置为右下角的全 1 子矩形数量
  - 预处理高度数组：定义 `h[j]` 表示第 `j` 列中，从当前行向上连续的 1 的个数（包括当前行）。比如当前行第 j 列是 0，则 `h[j] = 0`；如果是 1，则 `h[j] = h[j]（上一行的值） + 1`
  - 统计每行的子矩形数：对于每一行的高度数组 `h`，遍历每个位置 `j`，找到左侧第一个高度小于 `h[j]` 的位置 `left`，右侧第一个高度小于等于 `h[j]` 的位置 `right`（单调栈技巧），计算以 `h[j]` 为高度的子矩形数量；或者更简单的方式：对每个位置 `j`，找到当前行中 `j` 左侧连续的、高度≥`h[j]` 的列数，累加得到该行的子矩形总数

- 代码实现

  ```cpp
  class Solution {
  public:
      int numSubmat(vector<vector<int>>& mat) {
          if (mat.empty() || mat[0].empty()) {
              return 0;
          }

          int rows = mat.size();
          int cols = mat[0].size();
          vector<int> h(cols, 0);  // 高度数组，记录每列当前行向上连续1的个数
          int total = 0;           // 总子矩形数量

          // 按行遍历矩阵
          for (int i = 0; i < rows; ++i) {
              // 第一步：更新当前行的高度数组h
              for (int j = 0; j < cols; ++j) {
                  h[j] = (mat[i][j] == 1) ? h[j] + 1 : 0;
              }

              // 第二步：统计当前行对应的子矩形数量
              for (int j = 0; j < cols; ++j) {
                  if (h[j] == 0) {
                      continue;  // 高度为0，无全1子矩形
                  }
                  // 找到当前位置j向左的最小高度（限制子矩形的高度）
                  int min_h = h[j];
                  // 从j向左遍历，统计以h[j]为右边界的所有全1子矩形
                  for (int k = j; k >= 0 && h[k] > 0; --k) {
                      min_h = min(min_h, h[k]);  // 子矩形的高度由最小高度决定
                      total += min_h;            // 每向左一列，增加min_h个新的子矩形
                  }
              }
          }

          return total;
      }
  };
  ```

- 也可以用单调栈解决，将每行的统计复杂度降低到 $O(n)$，整体时间复杂度为 $O(mn)$
  - 快速找到每个位置 `j` 左侧第一个高度小于 `h[j]` 的列索引 `left`，避免内层循环遍历

- 代码实现

  ```cpp
  class Solution {
  public:
      int numSubmat(vector<vector<int>>& mat) {
          if (mat.empty() || mat[0].empty()) {
              return 0;
          }

          int rows = mat.size();
          int cols = mat[0].size();
          vector<int> h(cols, 0);
          int total = 0;

          for (int i = 0; i < rows; ++i) {
              // 更新高度数组
              for (int j = 0; j < cols; ++j) {
                  h[j] = mat[i][j] ? h[j] + 1 : 0;
              }

              // 单调栈统计当前行的子矩形数
              stack<int> st;  // 存储列索引，保证栈内高度单调递增
              vector<int> dp(cols, 0);  // dp[j]表示以j为右边界的子矩形数

              for (int j = 0; j < cols; ++j) {
                  // 弹出栈顶高度≥h[j]的元素，保持单调递增
                  while (!st.empty() && h[st.top()] >= h[j]) {
                      st.pop();
                  }

                  // 计算dp[j]
                  if (st.empty()) {
                      // 栈空，说明左侧所有列的高度都≥h[j]
                      dp[j] = h[j] * (j + 1);
                  } else {
                      // 栈顶是左侧第一个高度<h[j]的列
                      int left = st.top();
                      dp[j] = dp[left] + h[j] * (j - left);
                  }

                  st.push(j);
                  total += dp[j];
              }
          }

          return total;
      }
  };
  ```

### 全为 1 的正方形子矩阵

- 题目：[1277. 统计全为 1 的正方形子矩阵](https://leetcode.cn/problems/count-square-submatrices-with-all-ones/description/)

- 可以在最大正方形的基础上修改，以每个位置为右下角能够构成的最多正方形数量即为其能构成的最大正方形边长

  ```cpp
  class Solution {
  public:
      int largestRectangleArea(vector<int>& heights) {
          int n = heights.size();
          vector<int> left(n, -1);
          vector<int> right(n, n);
          stack<int> st;
          for (int i = 0; i < n; i++) {
              int h = heights[i];
              while (!st.empty() && heights[st.top()] >= h) {
                  right[st.top()] = i;
                  st.pop();
              }
              if (!st.empty()) {
                  left[i] = st.top();
              }
              st.push(i);
          }

          int ans = 0;
          for (int i = 0; i < n; i++) {
              int mn = min(heights[i], (right[i] - left[i] - 1));
              ans += mn;
          }
          return ans;
      }
      int countSquares(vector<vector<int>>& matrix) {
          vector<int> heights(matrix[0].size(), 0);
          int ans = 0;
          for (int i = 0; i < matrix.size(); i++) {
              for (int j = 0; j < matrix[i].size(); j++) {
                  if (matrix[i][j] == 0) {
                      heights[j] = 0;
                  } else {
                      heights[j] += 1;
                  }
              }
              ans += largestRectangleArea(heights);
          }
          return ans;
      }
  };
  ```

- 也可以用动态规划的方法来解决
  - 定义 `dp[i][j]` 表示以矩阵中第 `i` 行第 `j` 列的元素为右下角的全为 1 的方形的个数
  - 如果 `matrix[i][j] == '0'`，则 `dp[i][j] = 0`（因为包含 0 无法构成正方形）
  - 如果 `matrix[i][j] == '1'`，则 `dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1`（当前位置能构成的正方形个数，由左边、上边、左上角三个位置的最小值 + 1 决定）
  - 第一行和第一列的元素，如果是 '1'，则 `dp[i][j] = 1`（只能构成边长为 1 的正方形）
  - 遍历过程中累加当前位置能够构成的最大边长即可

- 代码实现

  ```cpp
  class Solution {
  public:
      int countSquares(vector<vector<int>>& matrix) {
          if (matrix.empty() || matrix[0].empty()) {
              return 0;
          }

          int rows = matrix.size();
          int cols = matrix[0].size();
          vector<vector<int>> dp(rows, vector<int>(cols, 0));
          int ans = 0;

          for (int i = 0; i < rows; ++i) {
              for (int j = 0; j < cols; ++j) {
                  if (matrix[i][j] == 1) {
                      if (i == 0 || j == 0) {
                          dp[i][j] = 1;
                      } else {
                          dp[i][j] = min({dp[i - 1][j], dp[i][j - 1],
                                          dp[i - 1][j - 1]}) +
                                     1;
                      }
                      ans += dp[i][j];
                  }
              }
          }

          return ans;
      }
  };
  ```

- 可以进一步优化空间

  ```cpp
  class Solution {
  public:
      int maximalSquare(vector<vector<char>>& matrix) {
          if (matrix.empty() || matrix[0].empty()) {
              return 0;
          }

          int rows = matrix.size();
          int cols = matrix[0].size();
          vector<int> dp(cols + 1, 0);  // 一维DP数组，多开1位避免边界判断
          int ans = 0;
          int prev = 0;  // 保存左上角的值（上一轮的dp[j-1]）

          for (int i = 1; i <= rows; ++i) {
              prev = 0;  // 每行开始时重置
              for (int j = 1; j <= cols; ++j) {
                  int temp = dp[j];  // 保存当前dp[j]，作为下一轮的prev
                  if (matrix[i-1][j-1] == '1') {
                      dp[j] = min({dp[j-1], dp[j], prev}) + 1;
                      ans+ = dp[j];
                  } else {
                      dp[j] = 0;  // 当前位置是0，无法构成正方形
                  }
                  prev = temp;
              }
          }

          return ans;
      }
  };
  ```

- 进一步优化空间

  ```cpp
  class Solution {
  public:
      int countSquares(vector<vector<int>>& matrix) {
          if (matrix.empty() || matrix[0].empty()) {
              return 0;
          }

          int rows = matrix.size();
          int cols = matrix[0].size();
          vector<int> dp(cols + 1, 0); // 一维DP数组，多开1位避免边界判断
          int ans = 0;
          int prev = 0; // 保存左上角的值（上一轮的dp[j-1]）

          for (int i = 1; i <= rows; ++i) {
              prev = 0; // 每行开始时重置
              for (int j = 1; j <= cols; ++j) {
                  int temp = dp[j]; // 保存当前dp[j]，作为下一轮的prev
                  if (matrix[i - 1][j - 1] == 1) {
                      dp[j] = min({dp[j - 1], dp[j], prev}) + 1;
                      ans += dp[j];
                  } else {
                      dp[j] = 0; // 当前位置是0，无法构成正方形
                  }
                  prev = temp;
              }
          }

          return ans;
      }
  };
  ```

### 好子数组的最大分数

- 题目：[1793. 好子数组的最大分数](https://leetcode.cn/problems/maximum-score-of-a-good-subarray/description/)

- 暴力的解法是，枚举每一个 i,j，找到这个窗口中的最小值，并更新结果

- 首先，考虑找到这个窗口中的最小值的优化，可以为左侧维护一个单调队列，右侧为一个单调队列，枚举每一个 i,j 对，窗口内的最小值就是两个单调队列的最小值，然后计算结果

  ```cpp
  class Solution {
  public:
      int maximumScore(vector<int>& nums, int k) {
          int n = nums.size();
          deque<int> left_que;
          for (int i = 0; i <= k; i++) {
              while (!left_que.empty() && nums[left_que.back()] > nums[i]) {
                  left_que.pop_back();
              }
              left_que.push_back(i);
          }
          int ans = 0;
          for (int i = 0; i <= k; i++) {
              deque<int> right_que;
              for (int j = k; j < n; j++) {
                  while (!right_que.empty() && nums[right_que.back()] > nums[j]) {
                      right_que.pop_back();
                  }
                  right_que.push_back(j);
                  int mn = min(nums[left_que.front()], nums[right_que.front()]);
                  ans = max(ans, mn * (j - i + 1));
              }
              if (left_que.front() == i) {
                  left_que.pop_front();
              }
          }
          return ans;
      }
  };
  ```

- 这种方法显然会超时，那么如何优化两层枚举？

- 中心扩展法：
  - 以 `k` 为中心，向左右两侧扩展，维护当前子数组的最小值
  - 每次扩展时，计算当前子数组的分数，并更新最大分数
  - 扩展策略：每次选择左右两侧数值较大的一侧扩展（贪心策略），这样能尽可能保留更大的最小值，从而可能得到更大的分数

- 代码实现

  ```cpp
  class Solution {
  public:
      int maximumScore(vector<int> &nums, int k) {
          int n = nums.size();
          int ans = nums[k], min_h = nums[k];
          int i = k, j = k;
          for (int t = 0; t < n - 1; t++) { // 循环 n-1 次
              if (j == n - 1 || i && nums[i - 1] > nums[j + 1]) {
                  min_h = min(min_h, nums[--i]);
              } else {
                  min_h = min(min_h, nums[++j]);
              }
              ans = max(ans, min_h * (j - i + 1));
          }
          return ans;
      }
  };
  ```

- 单调栈做法
  - 预处理区间边界：用单调栈分别求出每个元素 `nums[i]` 作为最小值时，左边第一个比它小的元素下标 `left_bound[i]`，右边第一个比它小的元素下标 `right_bound[i]`
  - 这样，以 `nums[i]` 为最小值的最大子数组区间就是 `(left_bound[i], right_bound[i])`（左开右开），即区间范围为 `[left_bound[i]+1, right_bound[i]-1]`。
  - 筛选并计算最大分数：遍历每个元素，检查其对应的最大区间是否包含 `k`（即 `left_bound[i]+1 <= k <= right_bound[i]-1`），若包含则计算分数 `nums[i] * (right_bound[i]-1 - (left_bound[i]+1) + 1)`，最终取最大值

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <stack>
  #include <algorithm>

  using namespace std;

  int maximumScore(vector<int>& nums, int k) {
      int n = nums.size();
      vector<int> left_bound(n, -1);  // 每个元素左边第一个更小元素的下标，初始为-1（表示无）
      vector<int> right_bound(n, n);  // 每个元素右边第一个更小元素的下标，初始为n（表示无）
      stack<int> st;  // 单调递增栈，存储元素下标

      // 第一步：求每个元素左边第一个更小的元素下标
      for (int i = 0; i < n; ++i) {
          // 栈不为空且栈顶元素对应的值 >= 当前值，弹出栈顶（破坏递增性）
          while (!st.empty() && nums[st.top()] >= nums[i]) {
              st.pop();
          }
          // 栈不为空则栈顶是左边第一个更小的元素，否则为-1
          if (!st.empty()) {
              left_bound[i] = st.top();
          }
          st.push(i);
      }

      // 清空栈，用于求右边界
      while (!st.empty()) {
          st.pop();
      }

      // 第二步：求每个元素右边第一个更小的元素下标
      for (int i = n - 1; i >= 0; --i) {
          // 栈不为空且栈顶元素对应的值 >= 当前值，弹出栈顶
          while (!st.empty() && nums[st.top()] >= nums[i]) {
              st.pop();
          }
          // 栈不为空则栈顶是右边第一个更小的元素，否则为n
          if (!st.empty()) {
              right_bound[i] = st.top();
          }
          st.push(i);
      }

      // 第三步：遍历所有元素，筛选包含k的区间，计算最大分数
      int max_score = 0;
      for (int i = 0; i < n; ++i) {
          int l = left_bound[i] + 1;  // 以nums[i]为最小值的区间左边界（闭）
          int r = right_bound[i] - 1; // 以nums[i]为最小值的区间右边界（闭）
          // 检查区间[l, r]是否包含k
          if (l <= k && k <= r) {
              int current_score = nums[i] * (r - l + 1);
              max_score = max(max_score, current_score);
          }
      }

      return max_score;
  }
  ```

### 子数组的最小值之和

- 计算以 arr[i] 为最小值的子数组的个数
  - 暴力做法是枚举所有子数组，算出每个子数组的最小值
  - 可以换个角度，计算每个元素以其作为最小值的子数组个数
  - 显然，找到 arr[i] 左侧的第一个比它更小的值（如果没有就是 -1），右侧的第一个比它更小的值（如果没有就是 n）
  - 一般地，设 _arr_[*i*] 对应的边界为开区间 (_L_,_R_)，由于子数组必须包含 _arr_[*i*]：
    - 子数组的左端点可以是 _L_+1,_L_+2,⋯,_i_，共有 *i*−*L* 个；
    - 子数组的右端点可以是 _i_,_i_+1,⋯,*R*−1，共有 *R*−*i* 个
  - 因此，在 arr 不含重复元素的前提下，根据乘法原理，我们可以得出如下结论：
  - 以 _arr_[*i*] 为最小值的子数组的个数为 (*i*−*L*)⋅(*R*−*i*)，对答案的贡献为 _arr_[*i*]⋅(*i*−*L*)⋅(*R*−*i*)
  - 为了避免重复元素的影响，因此需要把右边界的定义改为右侧第一个不超过它的元素，这样可以避免重复统计子数组
  - 为什么不把左右两侧都改为不超过呢？这样会导致以右侧重复元素为中心的左侧子数组漏统计

- 代码实现

  ```cpp
  class Solution {
      const int MOD = 1e9 + 7;
  public:
      int sumSubarrayMins(vector<int> &arr) {
          int n = arr.size();
          // 左边界 left[i] 为左侧严格小于 arr[i] 的最近元素位置（不存在时为 -1）
          vector<int> left(n, -1);
          stack<int> st;
          for (int i = 0; i < n; ++i) {
              while (!st.empty() && arr[st.top()] >= arr[i])
                  st.pop(); // 移除无用数据
              if (!st.empty()) left[i] = st.top();
              st.push(i);
          }

          // 右边界 right[i] 为右侧小于等于 arr[i] 的最近元素位置（不存在时为 n）
          vector<int> right(n, n);
          while (!st.empty()) st.pop();
          for (int i = n - 1; i >= 0; --i) {
              while (!st.empty() && arr[st.top()] > arr[i])
                  st.pop(); // 移除无用数据
              if (!st.empty()) right[i] = st.top();
              st.push(i);
          }

          long ans = 0L;
          for (int i = 0; i < n; ++i)
              ans += (long) arr[i] * (i - left[i]) * (right[i] - i); // 累加贡献
          return ans % MOD;
      }
  };
  ```

- 上述代码进行了三次遍历，计算左侧、计算右侧、计算结果

- 实际上在计算左侧的过程中，如果栈顶元素大于当前元素，说明当前元素就是栈顶元素的下一个更小值，且如果一个元素的右侧有多个重复元素，其只会被第一个重复元素弹出，因此符合右边界的定义

  ```cpp
  class Solution {
      const int MOD = 1e9 + 7;
  public:
      int sumSubarrayMins(vector<int> &arr) {
          int n = arr.size();
          vector<int> left(n, -1), right(n, n);
          stack<int> st;
          for (int i = 0; i < n; ++i) {
              while (!st.empty() && arr[st.top()] >= arr[i]) {
                  right[st.top()] = i; // i 恰好是栈顶的右边界
                  st.pop();
              }
              if (!st.empty()) left[i] = st.top();
              st.push(i);
          }

          long ans = 0L;
          for (int i = 0; i < n; ++i)
              ans += (long) arr[i] * (i - left[i]) * (right[i] - i); // 累加贡献
          return ans % MOD;
      }
  };
  ```

- 进一步地，由于栈顶下面的元素正好也是栈顶的左边界，因为在将栈顶元素压入栈顶时，其会把所有大于等于自己的元素弹出，剩下的栈顶正好是这个栈顶元素的左边界

- 为了简化左边界计算，可以压入一个哨兵 -1，表示左侧没有更小的元素，此时其左侧贡献为 i+1，也符合定义

- 如果不加入哨兵，可能在循环结束时，栈中还有元素没有处理

  ```cpp
  class Solution {
      const int MOD = 1e9 + 7;
  public:
      int sumSubarrayMins(vector<int> &arr) {
          long ans = 0L;
          arr.push_back(-1);
          stack<int> st;
          st.push(-1); // 哨兵
          for (int r = 0; r < arr.size(); ++r) {
              while (st.size() > 1 && arr[st.top()] >= arr[r]) {
                  int i = st.top();
                  st.pop();
                  ans += (long) arr[i] * (i - st.top()) * (r - i); // 累加贡献
              }
              st.push(r);
          }
          return ans % MOD;
      }
  };
  ```

### 移掉 K 位数字

- 题目：[402. 移掉 K 位数字](https://leetcode.cn/problems/remove-k-digits/description/)

- 给你一个以字符串表示的非负整数 `num` 和一个整数 `k` ，移除这个数中的 `k` 位数字，使得剩下的数字最小。请你以字符串形式返回这个最小的数字

- 显然，左侧的数字越小，字典序就越小，因此需要优先移除左侧较大的数字，可以使用一个单调栈，当前数字比栈顶小时，就应该弹出栈顶，标记为删除

- 代码实现

  ```cpp
  class Solution {
  public:
      string removeKdigits(string num, int k) {
          stack<char> st; // 直接存储字符而非索引，简化逻辑

          // 核心单调栈逻辑：构建递增序列
          for (char c : num) {
              // 当还有删除次数，且栈顶元素大于当前元素时，弹出栈顶（删除）
              while (k > 0 && !st.empty() && st.top() > c) {
                  st.pop();
                  k--;
              }
              st.push(c);
          }

          // 处理剩余的删除次数（此时栈内是递增序列，删除末尾元素）
          while (k > 0 && !st.empty()) {
              st.pop();
              k--;
          }

          // 构建结果并去除前导零
          string res;
          while (!st.empty()) {
              res += st.top();
              st.pop();
          }
          reverse(res.begin(), res.end()); // 栈弹出是逆序，需要反转

          // 去除前导零
          int start = 0;
          while (start < res.size() && res[start] == '0') {
              start++;
          }
          res = res.substr(start);

          // 处理空字符串情况
          return res.empty() ? "0" : res;
      }
  };
  ```

### 找出最具竞争力的子序列

- 题目：[1673. 找出最具竞争力的子序列](https://leetcode.cn/problems/find-the-most-competitive-subsequence/description/)

- 给你一个整数数组 `nums` 和一个正整数 `k` ，返回长度为 `k` 且最具 竞争力 的 `nums` 子序列

- 数组的子序列是从数组中删除一些元素（可能不删除元素）得到的序列

- 在子序列 `a` 和子序列 `b` 第一个不相同的位置上，如果 `a` 中的数字小于 `b` 中对应的数字，那么我们称子序列 `a` 比子序列 `b`（相同长度下）更具 竞争力 。 例如，`[1,3,4]` 比 `[1,3,5]` 更具竞争力，在第一个不相同的位置，也就是最后一个位置上， `4` 小于 `5`

- 逻辑与上一题类似

  ```cpp
  class Solution {
  public:
      vector<int> mostCompetitive(vector<int>& nums, int k) {
          stack<int> st;
          int n = nums.size();
          k = n - k;
          for (int i = 0; i < n; i++) {
              while (k > 0 && !st.empty() && nums[st.top()] > nums[i]) {
                  st.pop();
                  k--;
              }
              st.push(i);
          }
          while (k > 0 && !st.empty()) {
              st.pop();
              k--;
          }
          vector<int> res;
          while (!st.empty()) {
              res.push_back(nums[st.top()]);
              st.pop();
          }
          reverse(res.begin(), res.end());
          return res;
      }
  };
  ```

- 可以直接用数组代替栈

  ```cpp
  class Solution {
  public:
      vector<int> mostCompetitive(vector<int>& nums, int k) {
          vector<int> st;
          for (int i = 0; i < nums.size(); i++) {
              int x = nums[i];
              while (!st.empty() && x < st.back() && st.size() + nums.size() - i > k) {
                  st.pop_back();
              }
              if (st.size() < k) {
                  st.push_back(x);
              }
          }
          return st;
      }
  };
  ```

### 去除重复的字符

- 题目：[316. 去除重复字母](https://leetcode.cn/problems/remove-duplicate-letters/)

- 差异之处

  | 维度         | 移除 K 位数字（402 题）                   | 去除重复字母求最小字典序（316/1081 题）                        |
  | ------------ | ----------------------------------------- | -------------------------------------------------------------- |
  | 核心目标     | 移除恰好 K 个字符，使结果最小             | 去重（每个字符仅出现一次），使结果最小                         |
  | 删除触发条件 | 栈顶 > 当前字符 且 剩余删除次数 k > 0     | 栈顶 > 当前字符 且 栈顶字符后续还会出现 且 当前字符未入栈      |
  | 删除次数限制 | 有明确的 k 次上限，遍历后可能需继续删末尾 | 无固定次数，删除仅为了去重和优化字典序                         |
  | 唯一性约束   | 无（结果可包含重复数字）                  | 强约束（结果必须是 distinct 字符）                             |
  | 关键辅助     | 仅需栈（记录数字）                        | 栈 + 两个数组（`in_stack`标记是否在栈中、`count`统计剩余次数） |
  | 边界处理     | 需处理前导零、删除后为空的情况            | 无需前导零，结果必为非空（每个字符至少出现一次）               |

- 这道题目与移掉 K 位数字不同，这里至少要保证每个字母存在一次，因此不能贪心的删除字符

- 代码实现

  ```cpp
  class Solution {
  public:
      string removeDuplicateLetters(string s) {
          int left[26]{};
          for (char c : s) {
              left[c - 'a']++; // 统计每个字母的出现次数
          }

          string ans; // 当作栈
          bool in_ans[26]{};
          for (char c : s) {
              left[c - 'a']--;
              if (in_ans[c - 'a']) { // ans 中不能有重复字母
                  continue;
              }
              while (!ans.empty() && c < ans.back() && left[ans.back() - 'a']) {
                  // (设 x=ans.back()) 如果 c < x，且右边还有 x，那么可以把 x
                  // 去掉， 因为后面可以重新把 x 加到 ans 中
                  in_ans[ans.back() - 'a'] = false; // 标记栈顶不在 ans 中
                  ans.pop_back();
              }
              ans += c;               // 把 c 加到 ans 的末尾
              in_ans[c - 'a'] = true; // 标记 c 在 ans 中
          }
          return ans;
      }
  };
  ```

## 对顶栈

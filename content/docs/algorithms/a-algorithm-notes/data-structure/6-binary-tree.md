---
title: 二叉树
description: 二叉树的种类、遍历方式、常见操作与经典算法题解
---

## 二叉树的种类

- 二叉树的类型（按结构特征）
  - 满二叉树
    - 如果一棵二叉树只有度为0的结点和度为2的结点，并且度为0的结点在同一层上
    - 深度为 $k$ 的满二叉树，总共有 $2^k-1$ 个节点
    - 第 $h$ 层的节点数为 $2^{h-1}$
  - 完全二叉树
    - 除了最底层节点可能没填满外，其余每层节点数都达到最大值；并且最下面一层的节点都集中在该层最左边的若干位置
    - 完全二叉树是满二叉树的 “子集”（满二叉树一定是完全二叉树，但反之不成立）
    - 堆就是一颗完全二叉树，同时保证父子节点的顺序关系
  - 完美二叉树
    - 所有叶子节点都在同一层级的树，且每个父节点恰有两个子节点
    - 本质就是满二叉树的另一种称呼
  - 平衡二叉树
    - 任意节点的左右子树的高度差的绝对值 ≤ 1（核心是 “高度平衡”，避免单侧子树过长）
    - 常见实现：AVL 树（严格平衡，高度差≤1）、红黑树（近似平衡，黑高度平衡）
    - 查找 / 插入 / 删除的时间复杂度稳定在 O (log n)
  - 斜树（Skewed Binary Tree）
    - 所有节点都只有左子节点（左斜树）或右子节点（右斜树），本质是 “退化的二叉树”（性能等同于链表）
    - 高度 = 节点数 n
    - 查找 / 插入 / 删除的时间复杂度退化为 O (n)

- 二叉树的类型（按节点值特征）
  - 二叉搜索树（BST, Binary Search Tree）
    - 前面的树都是没有数值的，而二叉搜索树的每个节点有其数值，是一棵有序树
    - 若它的左子树不空，则左子树上所有结点的值均小于它的根结点的值；
    - 若它的右子树不空，则右子树上所有结点的值均大于它的根结点的值；
    - 它的左、右子树也分别为二叉搜索树
    - 二叉搜索树的中序遍历结果是严格升序的
    - 查找 / 插入 / 删除平均 O (log n)，最坏 O (n)（斜树退化）
  - 红黑树（Red-Black Tree）
    - 在二叉搜索树基础上增加 “颜色约束”（节点为红 / 黑），保证近似平衡：
      1. 根节点是黑色；
      2. 叶子节点（NIL 节点）是黑色；
      3. 红色节点的子节点必须是黑色（无连续红节点）；
      4. 从任意节点到其所有叶子节点的路径上，黑色节点数相同（黑高度平衡）
    - 高度不超过 2log (n+1)，查找 / 插入 / 删除 O (log n)
    - 插入 / 删除时通过 “变色 + 旋转” 维护约束，实现比 AVL 树简单

  - 堆（二叉堆，Binary Heap）
    - 基于完全二叉树的结构，且满足 “堆序性”：
      - 大顶堆：任意节点值 ≥ 其子节点值（根节点是最大值）；
      - 小顶堆：任意节点值 ≤ 其子节点值（根节点是最小值）
    - 用数组存储（节点 i 的左子节点 = 2i，右子节点 = 2i+1，父节点 = i/2）
    - 插入 / 删除堆顶 O (log n)，获取最值 O (1)

  - 哈夫曼树（Huffman Tree）
    - 带权路径长度（WPL）最小的二叉树（也称 “最优二叉树”），用于哈夫曼编码（数据压缩）
    - 权值越大的节点，离根节点越近
    - 没有度为 1 的节点（属于满二叉树的一种）
    - 构建方式：每次选两个权值最小的节点合并为新节点，直到只剩一个节点

  - 平衡二叉搜索树
    - 又被称为 AVL（Adelson-Velsky and Landis）树
    - 一棵空树或它的左右两个子树的高度差的绝对值不超过1，并且左右两个子树都是一棵平衡二叉树
    - C++ 中 map、set、multimap，multiset 的底层实现都是平衡二叉搜索树，所以 map、set 的增删操作时间时间复杂度是 $O(\log n)$​，而 unordered_map、unordered_set 的底层实现是哈希表

- 二叉树的类型（特殊场景）
  - 线索二叉树（Threaded Binary Tree）
    - 将二叉树的空指针改为 “线索”：
      - 空的左指针 → 指向该节点的中序前驱；
      - 空的右指针 → 指向该节点的中序后继
    - 无需栈 / 递归即可完成中序遍历（节省空间），解决普通二叉树空指针浪费空间的问题

  - 字典树（Trie 树，前缀树）
    - 多叉树的特殊形式（常简化为二叉实现），用于字符串前缀匹配，每个节点存储一个字符，路径代表字符串
    - 查找 / 插入字符串的时间复杂度 = 字符串长度（与字符集大小无关）

  - 二叉判定树（Decision Tree）
    - 每个节点代表一个 “判定条件”，分支代表判定结果，叶子节点代表最终结论
    - 用于决策分析、机器学习（分类树）

- 二叉树的存储方式
  - 二叉树可以链式存储，也可以顺序存储

  - 链式存储方式使用指针

    ```cpp
    struct TreeNode {
        int val;
        TreeNode *left;
        TreeNode *right;
        TreeNode(int x) : val(x), left(NULL), right(NULL) {}
    };
    ```

  - 顺序存储方式使用数组：用数组存储二叉树时，如果父节点的数组下标是 i，那么它的左孩子就是 i _ 2 + 1，右孩子就是 i _ 2 + 2

- 二叉树主要有两种遍历方式：
  - 深度优先遍历：先往深走，遇到叶子节点再往回走
    - 前序遍历（递归法，迭代法）：中左右
    - 中序遍历（递归法，迭代法）：左中右
    - 后序遍历（递归法，迭代法）：左右中
    - 前中后序遍历的逻辑可以借助栈使用递归的方式来实现
  - 广度优先遍历：一层一层的去遍历
    - 层次遍历（迭代法）
    - 广度优先遍历的实现一般使用队列来实现，这也是队列先进先出的特点所决定的

- 二叉树节点的深度：指从根节点到该节点的最长简单路径边的条数

- 二叉树节点的高度：指从该节点到叶子节点的最长简单路径边的条数

- ACM 模式构建二叉树

  ```cpp
  struct TreeNode {
      int val;
      TreeNode *left, *right;
      TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
  };

  TreeNode* buildFromLevelOrder(vector<int>& nums) {
      if (nums.empty() || nums[0] == -1) return nullptr;

      TreeNode* root = new TreeNode(nums[0]);
      queue<TreeNode*> q;
      q.push(root);

      int i = 1;
      int n = nums.size();
      while (!q.empty() && i < n) {
          TreeNode* cur = q.front(); q.pop();

          // 左孩子
          if (i < n && nums[i] != -1) {
              cur->left = new TreeNode(nums[i]);
              q.push(cur->left);
          }
          i++;

          // 右孩子
          if (i < n && nums[i] != -1) {
              cur->right = new TreeNode(nums[i]);
              q.push(cur->right);
          }
          i++;
      }
      return root;
  }

  TreeNode* buildFromArray(vector<int>& nums, int i) {
      // 越界 或 空节点
      if (i >= nums.size() || nums[i] == -1)
          return nullptr;

      TreeNode* root = new TreeNode(nums[i]);
      root->left  = buildFromArray(nums, 2*i + 1);
      root->right = buildFromArray(nums, 2*i + 2);
      return root;
  }

  // 调用：
  // TreeNode* root = buildFromArray(nums, 0);
  ```

## 遍历二叉树

### 总结

- 二叉树遍历的核心是按照特定顺序访问树中每个节点且仅访问一次：
  - 前序遍历：根节点 → 左子树 → 右子树
  - 中序遍历：左子树 → 根节点 → 右子树
  - 后序遍历：左子树 → 右子树 → 根节点
  - 层序遍历：从上到下、从左到右逐层访问节点
- 各种遍历算法的实现
  - 前序遍历（递归）：先访问当前根节点，再递归处理左子树，最后递归处理右子树；利用递归的栈特性，天然满足 “根→左→右” 的顺序
  - 前序遍历（迭代）：用栈模拟递归，先将根节点入栈；每次弹出栈顶节点并访问，再按 “右子树→左子树” 的顺序入栈（栈后进先出，保证左子树先被处理），最终实现 “根→左→右”
  - 中序遍历（递归）：先递归深入左子树直到叶子节点，再访问当前根节点，最后递归处理右子树；递归的深度优先特性保证 “左→根→右” 的顺序
  - 中序遍历（迭代）：用栈保存待访问的节点，先遍历到左子树最深处（沿途节点入栈）；弹出栈顶节点并访问，再将指针指向其右子树，重复上述过程，直到栈空且无待处理节点
  - 后序遍历（递归）：先递归处理左子树，再递归处理右子树，最后访问当前根节点；递归的回溯特性保证 “左→右→根” 的顺序
  - 后序遍历（迭代）：基于前序遍历变形，先按 “根→右→左” 的顺序遍历（入栈时先左后右），再将结果反转，即可得到 “左→右→根” 的后序遍历结果，是最易理解的迭代实现方式
  - 层序遍历（迭代）：用队列实现广度优先搜索（BFS），先将根节点入队；每次遍历当前队列中所有节点（即当前层），访问节点后将其左、右子节点依次入队，直到队列为空，保证 “逐层、从左到右” 访问——可以用于求解树的深度

- 自顶向下与自底向上
  - 前序遍历（根→左→右）：天然对应自顶向下的解题视角
    - 前序遍历的第一步是访问 “当前根节点”，再递归处理子节点
    - 这和自顶向下的思路完全一致：先利用当前节点的信息（比如传递 “当前深度”“当前路径和”），再把状态传递给子节点，让子节点继续处理

  - 后序遍历（左→右→根）：天然对应自底向上的解题视角
    - 后序遍历的最后一步才访问 “当前根节点”，必须等左右子节点都处理完才能处理当前节点
    - 这和自底向上的思路完全一致：先让子节点计算出结果（比如子树的深度、子树的和），再汇总子节点的结果，计算当前节点的答案并返回给父节点

  - 中序遍历（左→根→右）很少作为 “自顶向下 / 自底向上” 的核心视角，它的核心价值体现在二叉搜索树（BST）中：中序遍历 BST 的结果是升序的，这是 BST 的核心特征

- 无论用递归还是迭代实现前序 / 后序遍历，“自顶向下 / 自底向上” 的核心视角都不变：
  - 迭代前序：先弹出根节点处理 → 再压入右 / 左子节点 → 还是先处理父、后处理子；
  - 迭代后序：先处理完左右子节点 → 再处理根节点 → 还是先处理子、后处理父

### 递归写法

- 递归的写法
  - 确定递归函数的参数和返回值
  - 确定终止条件
  - 确定单层递归的逻辑

#### 前序遍历

- 前序遍历
  - 确定递归函数的参数和返回值：传入 vector 放节点的数值，传入树根节点指针
  - 确定终止条件：如果 cur 为 NULL 就要结束遍历
  - 确定单层递归的逻辑：先 push 当前节点的值，然后遍历左树和右树

- 前序遍历代码实现

  ```cpp
  class Solution {
  public:
      void traversal(TreeNode* cur, vector<int>& vec) {
          if (cur == NULL) return;
          vec.push_back(cur->val);    // 中
          traversal(cur->left, vec);  // 左
          traversal(cur->right, vec); // 右
      }
      vector<int> preorderTraversal(TreeNode* root) {
          vector<int> result;
          traversal(root, result);
          return result;
      }
  };
  ```

#### 中序遍历

- 中序遍历

  ```cpp
  void traversal(TreeNode* cur, vector<int>& vec) {
      if (cur == NULL) return;
      traversal(cur->left, vec);  // 左
      vec.push_back(cur->val);    // 中
      traversal(cur->right, vec); // 右
  }
  ```

#### 后序遍历

- 后序遍历

  ```cpp
  void traversal(TreeNode* cur, vector<int>& vec) {
      if (cur == NULL) return;
      traversal(cur->left, vec);  // 左
      traversal(cur->right, vec); // 右
      vec.push_back(cur->val);    // 中
  }
  ```

- 参考题目
  - [144.二叉树的前序遍历](https://leetcode.cn/problems/binary-tree-preorder-traversal/)
  - [145.二叉树的后序遍历](https://leetcode.cn/problems/binary-tree-postorder-traversal/)
  - [94.二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)
  - [589. N叉树的前序遍历](https://leetcode-cn.com/problems/n-ary-tree-preorder-traversal/)
  - [590. N叉树的后序遍历](https://leetcode-cn.com/problems/n-ary-tree-postorder-traversal/)

### 迭代写法

- 递归的实现就是：每一次递归调用都会把函数的局部变量、参数值和返回地址等压入调用栈中，然后递归返回的时候，从栈顶弹出上一次递归的各项参数

#### 前序遍历

- 在前序遍历中，先压入根节点，在循环中，先弹出根节点并放到 vector 中，然后压入右子树，再压入左子树，以此循环即可

  ```cpp
  class Solution {
  public:
      vector<int> preorderTraversal(TreeNode* root) {
          stack<TreeNode*> st;
          vector<int> result;
          if (root == NULL) return result;
          st.push(root);
          while (!st.empty()) {
              TreeNode* node = st.top();                       // 中
              st.pop();
              result.push_back(node->val);
              if (node->right) st.push(node->right);           // 右（空节点不入栈）
              if (node->left) st.push(node->left);             // 左（空节点不入栈）
          }
          return result;
      }
  };
  ```

#### 中序遍历

- 在中序遍历的递归写法中，对任意节点，遍历顺序为：递归遍历其左子树、访问该节点本身、递归遍历其右子树

- 递归之所以能自动 “记住” 遍历路径，是因为编程语言的调用栈：每次递归调用都会把当前函数的上下文（比如当前节点、执行到哪一步）压入栈，递归返回时再弹出恢复

- 迭代写法的核心，就是手动模拟这个调用栈，用栈结构保存遍历过程中的节点和状态

- 以一棵简单二叉树（根 = 1，左 = 2，右 = 3；2 的左 = 4，2 的右 = 5）为例，递归栈的执行流程：
  1. 调用 `inorder(1)` → 先压入 1，执行 `inorder(2)`
  2. 调用 `inorder(2)` → 压入 2，执行 `inorder(4)`
  3. 调用 `inorder(4)` → 压入 4，执行 `inorder(4->left)`（空，返回）
  4. 弹出 4 的上下文 → 访问 4 → 执行 `inorder(4->right)`（空，返回）
  5. 弹出 2 的上下文 → 访问 2 → 执行 `inorder(5)`
  6. 调用 `inorder(5)` → 压入 5，执行 `inorder(5->left)`（空，返回）
  7. 弹出 5 的上下文 → 访问 5 → 执行 `inorder(5->right)`（空，返回）
  8. 弹出 1 的上下文 → 访问 1 → 执行 `inorder(3)`
  9. 调用 `inorder(3)` → 压入 3，执行 `inorder(3->left)`（空，返回）
  10. 弹出 3 的上下文 → 访问 3 → 执行 `inorder(3->right)`（空，返回）

- 核心规律：先把左子树全部压栈，直到左空；然后弹出节点访问，再处理右子树

- 在迭代法中，直接仿照递归栈的逻辑，用栈保存节点，分两步：
  1. 左子树 “一路到底” 压栈；用 cur 是否为空表示是否需要开始弹出节点访问
  2. 弹出节点访问，再处理右子树（右子树重复第一步）

- 中序遍历的代码实现

  ```cpp
  class Solution {
  public:
      vector<int> inorderTraversal(TreeNode* root) {
          vector<int> result;
          stack<TreeNode*> st;
          TreeNode* cur = root;
          while (cur != NULL || !st.empty()) {
              if (cur != NULL) { // 指针来访问节点，访问到最底层
                  st.push(cur); // 将访问的节点放进栈
                  cur = cur->left;                // 左
              } else {
                  cur = st.top(); // 从栈里弹出的数据，就是要处理的数据（放进result数组里的数据）
                  st.pop();
                  result.push_back(cur->val);     // 中
                  cur = cur->right;               // 右
              }
          }
          return result;
      }
  };
  ```

- 中序遍历的另一种实现

  ```cpp
  void inorderIterative(TreeNode* root, vector<int>& res) {
      stack<TreeNode*> st; // 手动模拟递归栈，保存节点
      TreeNode* cur = root; // 当前遍历的节点

      // 循环条件：cur非空（还有左子树要压栈） 或 栈非空（还有节点没访问）
      while (cur != nullptr || !st.empty()) {
          // 第一步：把当前节点的所有左子树压栈（对应递归的左子树遍历）
          while (cur != nullptr) {
              st.push(cur);   // 压入当前节点（对应递归调用压栈）
              cur = cur->left;// 往左走，直到空
          }

          // 第二步：弹出栈顶节点（左子树处理完了）
          cur = st.top();
          st.pop();

          // 第三步：访问当前节点（对应递归中的res.push_back）
          res.push_back(cur->val);

          // 第四步：处理右子树（对应递归的右子树遍历）
          cur = cur->right;
      }
  }
  ```

- 还可以使用带状态的迭代写法，其本质是 “反向压栈”（右→当前→左），这种方法适用于所有递归遍历（前 / 中 / 后序）的转化，通用性更强：
  - 状态 0：节点待处理左子树（刚压入栈）
  - 状态 1：节点左子树处理完，可访问
  - 状态 2：节点已访问，待处理右子树

  ```cpp
  // 中序遍历 - 带状态的迭代写法（通用递归转迭代）
  void inorderIterativeWithState(TreeNode* root, vector<int>& res) {
      // 栈中保存pair：<节点指针，状态码>
      stack<pair<TreeNode*, int>> st;
      // 初始：根节点，状态0（待处理左子树）
      if (root != nullptr) st.push({root, 0});

      while (!st.empty()) {
          auto [node, state] = st.top();
          st.pop();

          if (state == 0) { // 状态0：处理左子树（对应递归的左调用）
              // 注意：栈是后进先出，所以反向压入（右→当前节点→左）
              if (node->right != nullptr) st.push({node->right, 0}); // 先压右（后处理）
              st.push({node, 1}); // 压入当前节点，状态改为1（待访问）
              if (node->left != nullptr) st.push({node->left, 0});  // 最后压左（先处理）
          } else if (state == 1) { // 状态1：访问节点（对应递归的访问操作）
              res.push_back(node->val);
          }
          // 状态2可省略，因为中序遍历访问后只需要处理右，而右已经在状态0压栈了
      }
  }
  ```

#### 后序遍历

- 后序遍历

  ```cpp
  class Solution {
  public:
      vector<int> postorderTraversal(TreeNode* root) {
          stack<TreeNode*> st;
          vector<int> result;
          if (root == NULL) return result;
          st.push(root);
          while (!st.empty()) {
              TreeNode* node = st.top();
              st.pop();
              result.push_back(node->val);
              if (node->left) st.push(node->left); // 相对于前序遍历，这更改一下入栈顺序 （空节点不入栈）
              if (node->right) st.push(node->right); // 空节点不入栈
          }
          reverse(result.begin(), result.end()); // 将结果反转之后就是左右中的顺序了
          return result;
      }
  };
  ```

### 统一迭代法

- 可以使用统一迭代法，将以上三种遍历方式统一起来

  ```cpp
  class Solution {
  public:
      vector<int> inorderTraversal(TreeNode* root) {
          vector<int> result;
          stack<TreeNode*> st;
          if (root != NULL) st.push(root);
          while (!st.empty()) {
              TreeNode* node = st.top();
              if (node != NULL) {
                  st.pop(); // 将该节点弹出，避免重复操作，下面再将右中左节点添加到栈中
                  if (node->right) st.push(node->right);  // 添加右节点（空节点不入栈）

                  st.push(node);                          // 添加中节点
                  st.push(NULL); // 中节点访问过，但是还没有处理，加入空节点做为标记。

                  if (node->left) st.push(node->left);    // 添加左节点（空节点不入栈）
              } else { // 只有遇到空节点的时候，才将下一个节点放进结果集
                  st.pop();           // 将空节点弹出
                  node = st.top();    // 重新取出栈中元素
                  st.pop();
                  result.push_back(node->val); // 加入到结果集
              }
          }
          return result;
      }
  };
  ```

- 统一迭代法前序遍历

  ```cpp
  class Solution {
  public:
      vector<int> preorderTraversal(TreeNode* root) {
          vector<int> result;
          stack<TreeNode*> st;
          if (root != NULL) st.push(root);
          while (!st.empty()) {
              TreeNode* node = st.top();
              if (node != NULL) {
                  st.pop();
                  if (node->right) st.push(node->right);  // 右
                  if (node->left) st.push(node->left);    // 左
                  st.push(node);                          // 中
                  st.push(NULL);
              } else {
                  st.pop();
                  node = st.top();
                  st.pop();
                  result.push_back(node->val);
              }
          }
          return result;
      }
  };
  ```

- 统一迭代法后序遍历

  ```cpp
  class Solution {
  public:
      vector<int> postorderTraversal(TreeNode* root) {
          vector<int> result;
          stack<TreeNode*> st;
          if (root != NULL) st.push(root);
          while (!st.empty()) {
              TreeNode* node = st.top();
              if (node != NULL) {
                  st.pop();
                  st.push(node);                          // 中
                  st.push(NULL);

                  if (node->right) st.push(node->right);  // 右
                  if (node->left) st.push(node->left);    // 左

              } else {
                  st.pop();
                  node = st.top();
                  st.pop();
                  result.push_back(node->val);
              }
          }
          return result;
      }
  };
  ```

- 布尔标记法

  ```cpp
  class Solution {
  public:
      vector<int> inorderTraversal(TreeNode* root) {
          vector<int> result;
          stack<pair<TreeNode*, bool>> st;
          if (root != nullptr)
              st.push(make_pair(root, false)); // 多加一个参数，false 为默认值，含义见下文注释

          while (!st.empty()) {
              auto node = st.top().first;
              auto visited = st.top().second; //多加一个 visited 参数，使“迭代统一写法”成为一件简单的事
              st.pop();

              if (visited) { // visited 为 True，表示该节点和两个儿子位次之前已经安排过了，现在可以收割节点了
                  result.push_back(node->val);
                  continue;
              }

              // visited 当前为 false, 表示初次访问本节点，此次访问的目的是“把自己和两个儿子在栈中安排好位次”。

              // 中序遍历是'左中右'，右儿子最先入栈，最后出栈。
              if (node->right)
                  st.push(make_pair(node->right, false));

              // 把自己加回到栈中，位置居中。
              // 同时，设置 visited 为 true，表示下次再访问本节点时，允许收割。
              st.push(make_pair(node, true));

              if (node->left)
                  st.push(make_pair(node->left, false)); // 左儿子最后入栈，最先出栈
          }

          return result;
      }
  };
  ```

### 层序遍历

- 给一个二叉树，返回其按层序遍历得到的节点值。 （即逐层地，从左到右访问所有节点）

- 迭代法

  ```cpp
  class Solution {
  public:
      vector<vector<int>> levelOrder(TreeNode* root) {
          queue<TreeNode*> que;
          if (root != NULL) que.push(root);
          vector<vector<int>> result;
          while (!que.empty()) {
              int size = que.size();
              vector<int> vec;
              // 这里一定要使用固定大小size，不要使用que.size()，因为que.size是不断变化的
              for (int i = 0; i < size; i++) {
                  TreeNode* node = que.front();
                  que.pop();
                  vec.push_back(node->val);
                  if (node->left) que.push(node->left);
                  if (node->right) que.push(node->right);
              }
              result.push_back(vec);
          }
          return result;
      }
  };
  ```

- 递归法

  ```cpp
  class Solution {
  public:
      void order(TreeNode* cur, vector<vector<int>>& result, int depth)
      {
          if (cur == nullptr) return;
          if (result.size() == depth) result.push_back(vector<int>());
          result[depth].push_back(cur->val);
          order(cur->left, result, depth + 1);
          order(cur->right, result, depth + 1);
      }
      vector<vector<int>> levelOrder(TreeNode* root) {
          vector<vector<int>> result;
          int depth = 0;
          order(root, result, depth);
          return result;
      }
  };
  ```

- 给定一个二叉树，返回其节点值自底向上的层次遍历。 （即按从叶子节点所在层到根节点所在的层，逐层从左向右遍历）

  ```cpp
  class Solution {
  public:
      vector<vector<int>> levelOrderBottom(TreeNode* root) {
          queue<TreeNode*> que;
          if (root != NULL) que.push(root);
          vector<vector<int>> result;
          while (!que.empty()) {
              int size = que.size();
              vector<int> vec;
              for (int i = 0; i < size; i++) {
                  TreeNode* node = que.front();
                  que.pop();
                  vec.push_back(node->val);
                  if (node->left) que.push(node->left);
                  if (node->right) que.push(node->right);
              }
              result.push_back(vec);
          }
          reverse(result.begin(), result.end()); // 在这里反转一下数组即可
          return result;

      }
  };
  ```

- 给定一棵二叉树，想象站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值

  ```cpp
  class Solution {
  public:
      vector<int> rightSideView(TreeNode* root) {
          queue<TreeNode*> que;
          if (root != NULL) que.push(root);
          vector<int> result;
          while (!que.empty()) {
              int size = que.size();
              for (int i = 0; i < size; i++) {
                  TreeNode* node = que.front();
                  que.pop();
                  if (i == (size - 1)) result.push_back(node->val); // 将每一层的最后元素放入result数组中
                  if (node->left) que.push(node->left);
                  if (node->right) que.push(node->right);
              }
          }
          return result;
      }
  };
  ```

- 给定一个非空二叉树, 返回一个由每层节点平均值组成的数组，类似地，可以求每行的最大值最小值

  ```cpp
  class Solution {
  public:
      vector<double> averageOfLevels(TreeNode* root) {
          queue<TreeNode*> que;
          if (root != NULL) que.push(root);
          vector<double> result;
          while (!que.empty()) {
              int size = que.size();
              double sum = 0; // 统计每一层的和
              for (int i = 0; i < size; i++) {
                  TreeNode* node = que.front();
                  que.pop();
                  sum += node->val;
                  if (node->left) que.push(node->left);
                  if (node->right) que.push(node->right);
              }
              result.push_back(sum / size); // 将每一层均值放进结果集
          }
          return result;
      }
  };
  ```

- 给定一个 N 叉树，返回其节点值的层序遍历。 (即从左到右，逐层遍历)

  ```cpp
  class Solution {
  public:
      vector<vector<int>> levelOrder(Node* root) {
          queue<Node*> que;
          if (root != NULL) que.push(root);
          vector<vector<int>> result;
          while (!que.empty()) {
              int size = que.size();
              vector<int> vec;
              for (int i = 0; i < size; i++) {
                  Node* node = que.front();
                  que.pop();
                  vec.push_back(node->val);
                  for (int i = 0; i < node->children.size(); i++) { // 将节点孩子加入队列
                      if (node->children[i]) que.push(node->children[i]);
                  }
              }
              result.push_back(vec);
          }
          return result;

      }
  };
  ```

- 给定一个完美二叉树，其所有叶子节点都在同一层，每个父节点都有两个子节点，二叉树定义如下

  ```cpp
  struct Node {
    int val;
    Node *left;
    Node *right;
    Node *next;
  }
  ```

- 填充它的每个 next 指针，让这个指针指向其下一个右侧节点。如果找不到下一个右侧节点，则将 next 指针设置为 NULL；初始状态下，所有 next 指针都被设置为 NULL

  ```cpp
  class Solution {
  public:
      Node* connect(Node* root) {
          queue<Node*> que;
          if (root != NULL) que.push(root);
          while (!que.empty()) {
              int size = que.size();
              // vector<int> vec;
              Node* nodePre;
              Node* node;
              for (int i = 0; i < size; i++) {
                  if (i == 0) {
                      nodePre = que.front(); // 取出一层的头结点
                      que.pop();
                      node = nodePre;
                  } else {
                      node = que.front();
                      que.pop();
                      nodePre->next = node; // 本层前一个节点next指向本节点
                      nodePre = nodePre->next;
                  }
                  if (node->left) que.push(node->left);
                  if (node->right) que.push(node->right);
              }
              nodePre->next = NULL; // 本层最后一个节点指向NULL
          }
          return root;

      }
  };
  ```

- 给定一个二叉树，找出其最大深度（二叉树的深度为根节点到最远叶子节点的最长路径上的节点数）

  ```cpp
  class Solution {
  public:
      int maxDepth(TreeNode* root) {
          if (root == NULL) return 0;
          int depth = 0;
          queue<TreeNode*> que;
          que.push(root);
          while(!que.empty()) {
              int size = que.size();
              depth++; // 记录深度
              for (int i = 0; i < size; i++) {
                  TreeNode* node = que.front();
                  que.pop();
                  if (node->left) que.push(node->left);
                  if (node->right) que.push(node->right);
              }
          }
          return depth;
      }
  };
  ```

- 求二叉树的最小深度：只有当左右孩子都为空的时候，才说明遍历到最低点，如果其中一个孩子为空则不是最低点

  ```cpp
  class Solution {
  public:
      int minDepth(TreeNode* root) {
          if (root == NULL) return 0;
          int depth = 0;
          queue<TreeNode*> que;
          que.push(root);
          while(!que.empty()) {
              int size = que.size();
              depth++; // 记录最小深度
              for (int i = 0; i < size; i++) {
                  TreeNode* node = que.front();
                  que.pop();
                  if (node->left) que.push(node->left);
                  if (node->right) que.push(node->right);
                  if (!node->left && !node->right) { // 当左右孩子都为空的时候，说明是最低点的一层了，退出
                      return depth;
                  }
              }
          }
          return depth;
      }
  };
  ```

- 相关题目
  - [102.二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)
  - [107.二叉树的层次遍历II](https://leetcode.cn/problems/binary-tree-level-order-traversal-ii/)
  - [199.二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/)
  - [637.二叉树的层平均值](https://leetcode.cn/problems/average-of-levels-in-binary-tree/)
  - [429.N叉树的层序遍历](https://leetcode.cn/problems/n-ary-tree-level-order-traversal/)
  - [515.在每个树行中找最大值](https://leetcode.cn/problems/find-largest-value-in-each-tree-row/)
  - [116.填充每个节点的下一个右侧节点指针](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/)
  - [117.填充每个节点的下一个右侧节点指针II](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node-ii/)
  - [104.二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)
  - [111.二叉树的最小深度](https://leetcode.cn/problems/minimum-depth-of-binary-tree/)

### Morries 遍历（线索二叉树）

- 在 $O (1)$​ 空间复杂度 下实现二叉树遍历（前序、中序、后序）的高效算法，核心是利用二叉树的空右指针来模拟递归 / 栈的遍历过程，避免额外空间开销

- Morris 遍历的核心是线索化二叉树：
  - 利用二叉树中叶子节点的空右指针，指向当前节点的中序后继节点（中序遍历中当前节点的下一个节点）；
  - 遍历过程中分为两步：
    - 找当前节点的前驱节点（中序遍历中当前节点的前一个节点，即左子树的最右节点）；
    - 通过前驱节点的右指针是否为空，判断是 “第一次访问当前节点” 还是 “回溯访问当前节点”；
  - 遍历完成后恢复二叉树的原始结构（可选，取决于是否需要保留原树）

- 中序遍历流程
  - 初始化当前节点 `cur` 为根节点；
  - 如果 `cur` 无左子树：
    - 访问 `cur` 节点；
    - `cur` 移动到其右子节点（`cur = cur.right`）；
  - 如果 `cur` 有左子树：
    - 找到 `cur` 的前驱节点 `pre`（左子树最右节点）；
    - 如果 `pre` 的右指针为空：
      - 将 `pre` 的右指针指向 `cur`（建立线索，用于回溯）；
      - `cur` 移动到其左子节点（`cur = cur.left`）；
    - 如果 `pre` 的右指针指向 `cur`（说明左子树已遍历完）：
      - 恢复 `pre` 的右指针为空（还原树结构）；
      - 访问 `cur` 节点；
      - `cur` 移动到其右子节点（`cur = cur.right`）；
  - 重复 2-3 直到 `cur` 为空

- 代码实现（中序遍历）

  ```cpp
  // Morris中序遍历
  vector<int> morrisInorder(TreeNode* root) {
      vector<int> result;
      TreeNode* cur = root;
      TreeNode* pre = nullptr;

      while (cur != nullptr) {
          // 情况1：当前节点无左子树，直接访问并转向右子树
          if (cur->left == nullptr) {
              result.push_back(cur->val);
              cur = cur->right;
          } else {
              // 情况2：找到当前节点的前驱节点（左子树最右节点）
              pre = cur->left;
              while (pre->right != nullptr && pre->right != cur) {
                  pre = pre->right;
              }

              // 子情况2.1：前驱节点右指针为空，建立线索（指向当前节点）
              if (pre->right == nullptr) {
                  pre->right = cur;
                  cur = cur->left;
              }
              // 子情况2.2：前驱节点右指针指向当前节点，说明左子树已遍历完
              else {
                  pre->right = nullptr;  // 恢复原树结构
                  result.push_back(cur->val);  // 访问当前节点
                  cur = cur->right;  // 转向右子树
              }
          }
      }
      return result;
  }
  ```

- 前序遍历

  ```cpp
  // Morris中序遍历
  vector<int> morrisInorder(TreeNode* root) {
      vector<int> result;
      TreeNode* cur = root;
      TreeNode* pre = nullptr;

      while (cur != nullptr) {
          // 情况1：当前节点无左子树，直接访问并转向右子树
          if (cur->left == nullptr) {
              result.push_back(cur->val);
              cur = cur->right;
          } else {
              // 情况2：找到当前节点的前驱节点（左子树最右节点）
              pre = cur->left;
              while (pre->right != nullptr && pre->right != cur) {
                  pre = pre->right;
              }

              // 子情况2.1：前驱节点右指针为空，建立线索（指向当前节点）
              if (pre->right == nullptr) {
                  pre->right = cur;
                  cur = cur->left;
              }
              // 子情况2.2：前驱节点右指针指向当前节点，说明左子树已遍历完
              else {
                  pre->right = nullptr;  // 恢复原树结构
                  result.push_back(cur->val);  // 访问当前节点
                  cur = cur->right;  // 转向右子树
              }
          }
      }
      return result;
  }
  ```

- 后序遍历需要通过 “逆序右边界” 的辅助函数实现

  ```cpp
  // 辅助函数：逆序二叉树的右边界（类似链表逆序）
  TreeNode* reverseRightEdge(TreeNode* node) {
      TreeNode* prev = nullptr;
      TreeNode* curr = node;
      while (curr != nullptr) {
          TreeNode* next = curr->right;
          curr->right = prev;
          prev = curr;
          curr = next;
      }
      return prev;
  }

  // 辅助函数：输出逆序后的右边界，并恢复原结构
  void printReversedEdge(TreeNode* node, vector<int>& result) {
      TreeNode* reversedHead = reverseRightEdge(node);
      TreeNode* curr = reversedHead;
      // 输出逆序后的节点值
      while (curr != nullptr) {
          result.push_back(curr->val);
          curr = curr->right;
      }
      // 恢复原树的右边界结构
      reverseRightEdge(reversedHead);
  }

  // Morris后序遍历
  vector<int> morrisPostorder(TreeNode* root) {
      vector<int> result;
      // 新建哨兵节点，避免单独处理根节点
      TreeNode* dummy = new TreeNode(0);
      dummy->left = root;
      TreeNode* cur = dummy;
      TreeNode* pre = nullptr;

      while (cur != nullptr) {
          if (cur->left == nullptr) {
              cur = cur->right;
          } else {
              pre = cur->left;
              while (pre->right != nullptr && pre->right != cur) {
                  pre = pre->right;
              }

              if (pre->right == nullptr) {
                  pre->right = cur;
                  cur = cur->left;
              } else {
                  pre->right = nullptr;  // 恢复树结构
                  // 逆序输出当前节点左子树的右边界
                  printReversedEdge(cur->left, result);
                  cur = cur->right;
              }
          }
      }
      // 释放哨兵节点内存
      delete dummy;
      return result;
  }
  ```

## 二叉树的应用

### 反转二叉树

- 即镜像交换左右指针

- 递归法（前序遍历）

  ```cpp
  class Solution {
  public:
      TreeNode* invertTree(TreeNode* root) {
          if (root == NULL) return root;
          swap(root->left, root->right);  // 中
          invertTree(root->left);         // 左
          invertTree(root->right);        // 右
          return root;
      }
  };
  ```

- 递归法（中序遍历）

  ```cpp
  class Solution {
  public:
      TreeNode* invertTree(TreeNode* root) {
          if (root == NULL) return root;
          invertTree(root->left);         // 左
          swap(root->left, root->right);  // 中
          invertTree(root->left);         // 注意 这里依然要遍历左孩子，因为中间节点已经翻转了
          return root;
      }
  };
  ```

- 迭代法（前序遍历）

  ```cpp
  class Solution {
  public:
      TreeNode* invertTree(TreeNode* root) {
          if (root == NULL) return root;
          stack<TreeNode*> st;
          st.push(root);
          while(!st.empty()) {
              TreeNode* node = st.top();              // 中
              st.pop();
              swap(node->left, node->right);
              if(node->right) st.push(node->right);   // 右
              if(node->left) st.push(node->left);     // 左
          }
          return root;
      }
  };

  class Solution2 {
  public:
      TreeNode* invertTree(TreeNode* root) {
          stack<TreeNode*> st;
          if (root != NULL) st.push(root);
          while (!st.empty()) {
              TreeNode* node = st.top();
              if (node != NULL) {
                  st.pop();
                  if (node->right) st.push(node->right);  // 右
                  if (node->left) st.push(node->left);    // 左
                  st.push(node);                          // 中
                  st.push(NULL);
              } else {
                  st.pop();
                  node = st.top();
                  st.pop();
                  swap(node->left, node->right);          // 节点处理逻辑
              }
          }
          return root;
      }
  };
  ```

- 迭代法（中序遍历）

  ```cpp
  class Solution {
  public:
      TreeNode* invertTree(TreeNode* root) {
          stack<TreeNode*> st;
          if (root != NULL) st.push(root);
          while (!st.empty()) {
              TreeNode* node = st.top();
              if (node != NULL) {
                  st.pop();
                  if (node->right) st.push(node->right);  // 右
                  st.push(node);                          // 中
                  st.push(NULL);
                  if (node->left) st.push(node->left);    // 左

              } else {
                  st.pop();
                  node = st.top();
                  st.pop();
                  swap(node->left, node->right);          // 节点处理逻辑
              }
          }
          return root;
      }
  };
  ```

- 广度优先遍历

  ```cpp
  class Solution {
  public:
      TreeNode* invertTree(TreeNode* root) {
          queue<TreeNode*> que;
          if (root != NULL) que.push(root);
          while (!que.empty()) {
              int size = que.size();
              for (int i = 0; i < size; i++) {
                  TreeNode* node = que.front();
                  que.pop();
                  swap(node->left, node->right); // 节点处理
                  if (node->left) que.push(node->left);
                  if (node->right) que.push(node->right);
              }
          }
          return root;
      }
  };
  ```

- 参考题目
  - [226. 翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/)
  - [2415. 反转二叉树的奇数层](https://leetcode.cn/problems/reverse-odd-levels-of-binary-tree/)

### 从中序与后序遍历序列构造二叉树

- 只有前序 + 中序，或者后序 + 中序的组合可以唯一确定一棵二叉树（前序 + 后序无法唯一确定）
  - 前序遍历：根节点 → 左子树 → 右子树（第一个元素是根）

  - 中序遍历：左子树 → 根节点 → 右子树（根节点把序列分成左右子树）

  - 后序遍历：左子树 → 右子树 → 根节点（最后一个元素是根）

- 根据一棵树的中序遍历与后序遍历构造二叉树
  - 第一步：如果数组大小为零的话，说明是空节点了
  - 第二步：如果不为空，那么取后序数组最后一个元素作为节点元素
  - 第三步：找到后序数组最后一个元素在中序数组的位置，作为切割点
  - 第四步：切割中序数组，切成中序左数组和中序右数组 （顺序别搞反了，一定是先切中序数组）
  - 第五步：切割后序数组，切成后序左数组和后序右数组
  - 第六步：递归处理左区间和右区间

- 示例代码

  ```cpp
  class Solution {
  private:
      TreeNode* traversal (vector<int>& inorder, vector<int>& postorder) {
          if (postorder.size() == 0) return NULL;

          // 后序遍历数组最后一个元素，就是当前的中间节点
          int rootValue = postorder[postorder.size() - 1];
          TreeNode* root = new TreeNode(rootValue);

          // 叶子节点
          if (postorder.size() == 1) return root;

          // 找到中序遍历的切割点
          int delimiterIndex;
          for (delimiterIndex = 0; delimiterIndex < inorder.size(); delimiterIndex++) {
              if (inorder[delimiterIndex] == rootValue) break;
          }

          // 切割中序数组
          // 左闭右开区间：[0, delimiterIndex)
          vector<int> leftInorder(inorder.begin(), inorder.begin() + delimiterIndex);
          // [delimiterIndex + 1, end)
          vector<int> rightInorder(inorder.begin() + delimiterIndex + 1, inorder.end() );

          // postorder 舍弃末尾元素
          postorder.resize(postorder.size() - 1);

          // 切割后序数组
          // 依然左闭右开，注意这里使用了左中序数组大小作为切割点
          // [0, leftInorder.size)
          vector<int> leftPostorder(postorder.begin(), postorder.begin() + leftInorder.size());
          // [leftInorder.size(), end)
          vector<int> rightPostorder(postorder.begin() + leftInorder.size(), postorder.end());

          root->left = traversal(leftInorder, leftPostorder);
          root->right = traversal(rightInorder, rightPostorder);

          return root;
      }
  public:
      TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
          if (inorder.size() == 0 || postorder.size() == 0) return NULL;
          return traversal(inorder, postorder);
      }
  };
  ```

- 相关题目
  - [106. 从中序与后序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)
  - [105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

- 前序和后序不能唯一确定一棵二叉树，因为没有中序遍历无法确定左右部分，也就是无法分割

### 对称二叉树

- 判断一个二叉树是否是镜像对称的，即比较两棵子树的里侧和外侧的元素是否相等

- 而因为要遍历两棵树而且要比较内侧和外侧节点，所以一个树的遍历顺序是左右中，一个树的遍历顺序是右左中

  ```cpp
  class Solution {
  public:
      bool compare(TreeNode* left, TreeNode* right) {
          // 首先排除空节点的情况
          if (left == NULL && right != NULL) return false;
          else if (left != NULL && right == NULL) return false;
          else if (left == NULL && right == NULL) return true;
          // 排除了空节点，再排除数值不相同的情况
          else if (left->val != right->val) return false;

          // 此时就是：左右节点都不为空，且数值相同的情况
          // 此时才做递归，做下一层的判断
          bool outside = compare(left->left, right->right);   // 左子树：左、 右子树：右
          bool inside = compare(left->right, right->left);    // 左子树：右、 右子树：左
          bool isSame = outside && inside;                    // 左子树：中、 右子树：中 （逻辑处理）
          return isSame;

      }
      bool isSymmetric(TreeNode* root) {
          if (root == NULL) return true;
          return compare(root->left, root->right);
      }
  };
  ```

- 迭代法

  ```cpp
  class Solution {
  public:
      bool isSymmetric(TreeNode* root) {
          if (root == NULL) return true;
          queue<TreeNode*> que;
          que.push(root->left);   // 将左子树头结点加入队列
          que.push(root->right);  // 将右子树头结点加入队列

          while (!que.empty()) {  // 接下来就要判断这两个树是否相互翻转
              TreeNode* leftNode = que.front(); que.pop();
              TreeNode* rightNode = que.front(); que.pop();
              if (!leftNode && !rightNode) {  // 左节点为空、右节点为空，此时说明是对称的
                  continue;
              }

              // 左右一个节点不为空，或者都不为空但数值不相同，返回false
              if ((!leftNode || !rightNode || (leftNode->val != rightNode->val))) {
                  return false;
              }
              que.push(leftNode->left);   // 加入左节点左孩子
              que.push(rightNode->right); // 加入右节点右孩子
              que.push(leftNode->right);  // 加入左节点右孩子
              que.push(rightNode->left);  // 加入右节点左孩子
          }
          return true;
      }
  };
  ```

- 使用栈

  ```cpp
  class Solution {
  public:
      bool isSymmetric(TreeNode* root) {
          if (root == NULL) return true;
          stack<TreeNode*> st; // 这里改成了栈
          st.push(root->left);
          st.push(root->right);
          while (!st.empty()) {
              TreeNode* rightNode = st.top(); st.pop();
              TreeNode* leftNode = st.top(); st.pop();
              if (!leftNode && !rightNode) {
                  continue;
              }
              if ((!leftNode || !rightNode || (leftNode->val != rightNode->val))) {
                  return false;
              }
              st.push(leftNode->left);
              st.push(rightNode->right);
              st.push(leftNode->right);
              st.push(rightNode->left);
          }
          return true;
      }
  };
  ```

- 参考题目
  - [101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree/description/)
  - [100.相同的树](https://leetcode.cn/problems/same-tree/)
  - [572.另一个树的子树](https://leetcode.cn/problems/subtree-of-another-tree/)

### 二叉树的最大深度

- 递归实现（后序）

  ```cpp
  class Solution {
  public:
      int getdepth(TreeNode* node) {
          if (node == NULL) return 0;
          int leftdepth = getdepth(node->left);       // 左
          int rightdepth = getdepth(node->right);     // 右
          int depth = 1 + max(leftdepth, rightdepth); // 中
          return depth;
      }
      int maxDepth(TreeNode* root) {
          return getdepth(root);
      }
  };
  ```

- 递归实现（前序）

  ```cpp
  class Solution {
  public:
      int result;
      void getdepth(TreeNode* node, int depth) {
          result = depth > result ? depth : result; // 中
          if (node->left == NULL && node->right == NULL) return ;
          if (node->left) { // 左
              getdepth(node->left, depth + 1);
          }
          if (node->right) { // 右
              getdepth(node->right, depth + 1);
          }
          return ;
      }
      int maxDepth(TreeNode* root) {
          result = 0;
          if (root == 0) return result;
          getdepth(root, 1);
          return result;
      }
  };
  ```

- 迭代法（层序遍历）

  ```cpp
  class Solution {
  public:
      int maxDepth(TreeNode* root) {
          if (root == NULL) return 0;
          int depth = 0;
          queue<TreeNode*> que;
          que.push(root);
          while(!que.empty()) {
              int size = que.size();
              depth++; // 记录深度
              for (int i = 0; i < size; i++) {
                  TreeNode* node = que.front();
                  que.pop();
                  if (node->left) que.push(node->left);
                  if (node->right) que.push(node->right);
              }
          }
          return depth;
      }
  };
  ```

- 实际上，前序遍历求得是深度，而后序遍历求得是高度，但是由于根节点的高度即为最大深度，因此后序遍历也可以用于求最大深度

- 前序遍历是 “先访问根、再处理子树”，对应深度的 “从上到下” 计数；后序遍历是 “先处理子树、再访问根”，对应高度的 “从下到上” 计数

- 前序遍历的核心是：先访问当前节点，再递归处理左、右子树， 当第一次访问某个节点时，它的父节点的深度已经确定，直接用 “父节点深度 + 1” 就能算出当前节点的深度

- 无法用前序遍历求高度：因为前序访问节点时，子树还没处理，根本不知道子树的最远叶子在哪里，无法计算当前节点的高度

- 后序遍历的核心是：先递归处理左、右子树，再访问当前节点，当处理完当前节点的所有子树后，子树的高度已经确定，用 “左右子树高度的最大值 + 1” 就能算出当前节点的高度

- 无法用后序遍历求深度：因为后序访问节点时，已经走过了从根到当前节点的路径，此时再计算深度需要额外记录路径，远不如前序直接

- 层序遍历（广度优先遍历 BFS）确实也是求二叉树深度的常用方法，而且是非常直观、高效的方式 —— 它通过 “按层遍历” 的特性，天然对应深度 “从上到下、逐层计数” 的逻辑，和前序遍历求深度是异曲同工的，只是实现思路不同

- 参考题目
  - [104.二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

  - [559.n叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-n-ary-tree/)

### 二叉树的最小深度

- 给定一个二叉树，找出其最小深度（最小深度是从根节点到最近叶子节点的最短路径上的节点数量，叶子节点是指没有子节点的节点）

- 递归法（后序）

  ```cpp
  class Solution {
  public:
      int getDepth(TreeNode* node) {
          if (node == NULL) return 0;
          int leftDepth = getDepth(node->left);           // 左
          int rightDepth = getDepth(node->right);         // 右
                                                          // 中
          // 当一个左子树为空，右不为空，这时并不是最低点
          if (node->left == NULL && node->right != NULL) {
              return 1 + rightDepth;
          }
          // 当一个右子树为空，左不为空，这时并不是最低点
          if (node->left != NULL && node->right == NULL) {
              return 1 + leftDepth;
          }
          int result = 1 + min(leftDepth, rightDepth);
          return result;
      }

      int minDepth(TreeNode* root) {
          return getDepth(root);
      }
  };
  ```

- 递归（前序遍历）

  ```cpp
  class Solution {
  private:
      int result;
      void getdepth(TreeNode* node, int depth) {
          // 函数递归终止条件
          if (node == nullptr) {
              return;
          }
          // 中，处理逻辑：判断是不是叶子结点
          if (node -> left == nullptr && node->right == nullptr) {
              result = min(result, depth);
          }
          if (node->left) { // 左
              getdepth(node->left, depth + 1);
          }
          if (node->right) { // 右
              getdepth(node->right, depth + 1);
          }
          return ;
      }

  public:
      int minDepth(TreeNode* root) {
          if (root == nullptr) {
              return 0;
          }
          result = INT_MAX;
          getdepth(root, 1);
          return result;
      }
  };
  ```

- 参考题目
  - [111. 二叉树的最小深度](https://leetcode.cn/problems/minimum-depth-of-binary-tree/)

### 完全二叉树的节点个数

- 按照普通二叉树的思想来解决，可以通过遍历方法计算

  ```cpp
  class Solution {
  private:
      int getNodesNum(TreeNode* cur) {
          if (cur == NULL) return 0;
          int leftNum = getNodesNum(cur->left);      // 左
          int rightNum = getNodesNum(cur->right);    // 右
          int treeNum = leftNum + rightNum + 1;      // 中
          return treeNum;
      }
  public:
      int countNodes(TreeNode* root) {
          return getNodesNum(root);
      }
  };
  ```

- 其时间复杂度为 $O(n)$，空间复杂度为 $O(\log n)$

- 迭代法

  ```cpp
  class Solution {
  public:
      int countNodes(TreeNode* root) {
          queue<TreeNode*> que;
          if (root != NULL) que.push(root);
          int result = 0;
          while (!que.empty()) {
              int size = que.size();
              for (int i = 0; i < size; i++) {
                  TreeNode* node = que.front();
                  que.pop();
                  result++;   // 记录节点数量
                  if (node->left) que.push(node->left);
                  if (node->right) que.push(node->right);
              }
          }
          return result;
      }
  };
  ```

- 利用完全二叉树的性质
  - 在完全二叉树中，除了最底层节点可能没填满外，其余每层节点数都达到最大值，并且最下面一层的节点都集中在该层最左边的若干位置
  - 若最底层为第 $h$ 层，则该层包含 $1\sim 2^{h-1}$ 个节点
  - 完全二叉树只有两种情况，情况一：就是满二叉树，情况二：最后一层叶子节点没有满
  - 对于情况一，可以直接用 $2^k-1$ 来计算总节点数
  - 对于情况二，分别递归左右孩子，递归到某一深度一定会有左孩子或者右孩子为满二叉树，此时仍可以归类为情况一

- 如何判断是否为满二叉树：在完全二叉树中，如果递归向左遍历的深度等于递归向右遍历的深度，那说明就是满二叉树

  ```cpp
  class Solution {
  public:
      int countNodes(TreeNode* root) {
          if (root == nullptr) return 0;
          TreeNode* left = root->left;
          TreeNode* right = root->right;
          int leftDepth = 0, rightDepth = 0; // 这里初始为0是有目的的，为了下面求指数方便
          while (left) {  // 求左子树深度
              left = left->left;
              leftDepth++;
          }
          while (right) { // 求右子树深度
              right = right->right;
              rightDepth++;
          }
          if (leftDepth == rightDepth) {
              return (2 << leftDepth) - 1; // 注意(2<<1) 相当于2^2，所以leftDepth初始为0
          }
          return countNodes(root->left) + countNodes(root->right) + 1;
      }
  };
  ```

- 上述方法的时间复杂度为 $O(\log^2 n)$，空间复杂度为 $O(\log n)$

- 参考题目
  - [222. 完全二叉树的节点个数](https://leetcode.cn/problems/count-complete-tree-nodes/)

### 平衡二叉树

- 给定一个二叉树，判断它是否是高度平衡的二叉树

- 一棵高度平衡二叉树定义为：一个二叉树每个节点的左右两个子树的高度差的绝对值不超过 1

- 这里，需要求二叉树的高度，因此应该使用后序遍历

  ```cpp
  class Solution {
  public:
      // 返回以该节点为根节点的二叉树的高度，如果不是平衡二叉树了则返回-1
      int getHeight(TreeNode* node) {
          if (node == NULL) {
              return 0;
          }
          int leftHeight = getHeight(node->left);
          if (leftHeight == -1) return -1;
          int rightHeight = getHeight(node->right);
          if (rightHeight == -1) return -1;
          return abs(leftHeight - rightHeight) > 1 ? -1 : 1 + max(leftHeight, rightHeight);
      }
      bool isBalanced(TreeNode* root) {
          return getHeight(root) == -1 ? false : true;
      }
  };
  ```

- 迭代方法

  ```cpp
  class Solution {
  private:
      int getDepth(TreeNode* cur) {
          stack<TreeNode*> st;
          if (cur != NULL) st.push(cur);
          int depth = 0; // 记录深度
          int result = 0;
          while (!st.empty()) {
              TreeNode* node = st.top();
              if (node != NULL) {
                  st.pop();
                  st.push(node);                          // 中
                  st.push(NULL);
                  depth++;
                  if (node->right) st.push(node->right);  // 右
                  if (node->left) st.push(node->left);    // 左

              } else {
                  st.pop();
                  node = st.top();
                  st.pop();
                  depth--;
              }
              result = result > depth ? result : depth;
          }
          return result;
      }

  public:
      bool isBalanced(TreeNode* root) {
          stack<TreeNode*> st;
          if (root == NULL) return true;
          st.push(root);
          while (!st.empty()) {
              TreeNode* node = st.top();                       // 中
              st.pop();
              if (abs(getDepth(node->left) - getDepth(node->right)) > 1) {
                  return false;
              }
              if (node->right) st.push(node->right);           // 右（空节点不入栈）
              if (node->left) st.push(node->left);             // 左（空节点不入栈）
          }
          return true;
      }
  };
  ```

- 这道题用迭代法，其实效率很低，因为没有很好的模拟回溯的过程，所以迭代法有很多重复的计算

- 参考题目
  - [110. 平衡二叉树](https://leetcode.cn/problems/balanced-binary-tree/)
  - [3319. 第 K 大的完美二叉子树的大小](https://leetcode.cn/problems/k-th-largest-perfect-subtree-size-in-binary-tree/description/)
  - [3340. 检查平衡字符串](https://leetcode.cn/problems/check-balanced-string/description/)

### 二叉树的所有路径

- 给定一个二叉树，返回所有从根节点到叶子节点的路径

- 要求给出从根节点到叶子节点的路径，因此需要前序遍历

- 这里需要涉及回溯，需要把路径记录下来，从而回退一个路径再进入另一个路径

- 示例代码

  ```cpp
  class Solution {
  private:

      void traversal(TreeNode* cur, string path, vector<string>& result) {
          path += to_string(cur->val); // 中
          if (cur->left == NULL && cur->right == NULL) {
              result.push_back(path);
              return;
          }
          if (cur->left) traversal(cur->left, path + "->", result); // 左
          if (cur->right) traversal(cur->right, path + "->", result); // 右
      }

  public:
      vector<string> binaryTreePaths(TreeNode* root) {
          vector<string> result;
          string path;
          if (root == NULL) return result;
          traversal(root, path, result);
          return result;

      }
  };
  ```

- 如果把 `path + "->"` 作为函数参数就是可以的，因为并没有改变 path 的数值，执行完递归函数之后，path 依然是之前的数值（相当于回溯了）

- 迭代法

  ```cpp
  class Solution {
  public:
      vector<string> binaryTreePaths(TreeNode* root) {
          stack<TreeNode*> treeSt;// 保存树的遍历节点
          stack<string> pathSt;   // 保存遍历路径的节点
          vector<string> result;  // 保存最终路径集合
          if (root == NULL) return result;
          treeSt.push(root);
          pathSt.push(to_string(root->val));
          while (!treeSt.empty()) {
              TreeNode* node = treeSt.top(); treeSt.pop(); // 取出节点 中
              string path = pathSt.top();pathSt.pop();    // 取出该节点对应的路径
              if (node->left == NULL && node->right == NULL) { // 遇到叶子节点
                  result.push_back(path);
              }
              if (node->right) { // 右
                  treeSt.push(node->right);
                  pathSt.push(path + "->" + to_string(node->right->val));
              }
              if (node->left) { // 左
                  treeSt.push(node->left);
                  pathSt.push(path + "->" + to_string(node->left->val));
              }
          }
          return result;
      }
  };
  ```

- 参考题目
  - [257. 二叉树的所有路径](https://leetcode.cn/problems/binary-tree-paths/)
  - [112. 路径总和](https://leetcode.cn/problems/path-sum/description/)
  - [113. 路径总和 II](https://leetcode.cn/problems/path-sum-ii/)
  - [988. 从叶结点开始的最小字符串](https://leetcode.cn/problems/smallest-string-starting-from-leaf/description/)
  - [2096. 从二叉树一个节点到另一个节点每一步的方向](https://leetcode.cn/problems/step-by-step-directions-from-a-binary-tree-node-to-another/description/)

### 左叶子之和

- 首先要判断是否为左叶子，必须通过叶子结点的父节点来判断其左孩子是否为左叶子

- 如果该节点的左节点不为空，而且该节点的左节点的左节点为空，该节点的左节点的右节点为空，则找到了一个左叶子

- 递归法

  ```cpp
  class Solution {
  public:
      int sumOfLeftLeaves(TreeNode* root) {
          if (root == NULL) return 0;
          int leftValue = 0;
          if (root->left != NULL && root->left->left == NULL && root->left->right == NULL) {
              leftValue = root->left->val;
          }
          return leftValue + sumOfLeftLeaves(root->left) + sumOfLeftLeaves(root->right);
      }
  };
  ```

- 迭代法

  ```cpp
  class Solution {
  public:
      int sumOfLeftLeaves(TreeNode* root) {
          stack<TreeNode*> st;
          if (root == NULL) return 0;
          st.push(root);
          int result = 0;
          while (!st.empty()) {
              TreeNode* node = st.top();
              st.pop();
              if (node->left != NULL && node->left->left == NULL && node->left->right == NULL) {
                  result += node->left->val;
              }
              if (node->right) st.push(node->right);
              if (node->left) st.push(node->left);
          }
          return result;
      }
  };
  ```

- 参考题目
  - [404. 左叶子之和](https://leetcode.cn/problems/sum-of-left-leaves/description/)

### 找树左下角的值

- 给定一个二叉树，在树的最后一行找到最左边的值

- 递归法

  ```cpp
  class Solution {
  public:
      int maxDepth = INT_MIN;
      int result;
      void traversal(TreeNode* root, int depth) {
          if (root->left == NULL && root->right == NULL) {
              if (depth > maxDepth) {
                  maxDepth = depth;
                  result = root->val;
              }
              return;
          }
          if (root->left) {
              traversal(root->left, depth + 1); // 隐藏着回溯
          }
          if (root->right) {
              traversal(root->right, depth + 1); // 隐藏着回溯
          }
          return;
      }
      int findBottomLeftValue(TreeNode* root) {
          traversal(root, 0);
          return result;
      }
  };
  ```

- 也可以采用层序遍历的方式来解决

  ```cpp
  class Solution {
  public:
      int findBottomLeftValue(TreeNode* root) {
          queue<TreeNode*> que;
          if (root != NULL) que.push(root);
          int result = 0;
          while (!que.empty()) {
              int size = que.size();
              for (int i = 0; i < size; i++) {
                  TreeNode* node = que.front();
                  que.pop();
                  if (i == 0) result = node->val; // 记录最后一行第一个元素
                  if (node->left) que.push(node->left);
                  if (node->right) que.push(node->right);
              }
          }
          return result;
      }
  };
  ```

- 参考题目
  - [513. 找树左下角的值](https://leetcode.cn/problems/find-bottom-left-tree-value/)

### 最大二叉树

- 给定一个不含重复元素的整数数组。一个以此数组构建的最大二叉树定义如下：
  - 二叉树的根是数组中的最大元素
  - 左子树是通过数组中最大值左边部分构造出的最大二叉树
  - 右子树是通过数组中最大值右边部分构造出的最大二叉树

- 通过给定的数组构建最大二叉树，并且输出这个树的根节点

- 构造树一般采用的是前序遍历，因为先构造中间节点，然后递归构造左子树和右子树

- 示例代码

  ```cpp
  class Solution {
  private:
      // 在左闭右开区间[left, right)，构造二叉树
      TreeNode* traversal(vector<int>& nums, int left, int right) {
          if (left >= right) return nullptr;

          // 分割点下标：maxValueIndex
          int maxValueIndex = left;
          for (int i = left + 1; i < right; ++i) {
              if (nums[i] > nums[maxValueIndex]) maxValueIndex = i;
          }

          TreeNode* root = new TreeNode(nums[maxValueIndex]);

          // 左闭右开：[left, maxValueIndex)
          root->left = traversal(nums, left, maxValueIndex);

          // 左闭右开：[maxValueIndex + 1, right)
          root->right = traversal(nums, maxValueIndex + 1, right);

          return root;
      }
  public:
      TreeNode* constructMaximumBinaryTree(vector<int>& nums) {
          return traversal(nums, 0, nums.size());
      }
  };
  ```

- 相关题目
  - [654. 最大二叉树](https://leetcode.cn/problems/maximum-binary-tree/)
  - [998. 最大二叉树 II](https://leetcode.cn/problems/maximum-binary-tree-ii/)

### 合并二叉树

- 给定两个二叉树，想象当将它们中的一个覆盖到另一个上时，两个二叉树的一些节点便会重叠

- 现在，需要将他们合并为一个新的二叉树。合并的规则是如果两个节点重叠，那么将他们的值相加作为节点合并后的新值，否则不为 NULL 的节点将直接作为新二叉树的节点

- 递归方法

  ```cpp
  class Solution {
  public:
      TreeNode* mergeTrees(TreeNode* t1, TreeNode* t2) {
          if (t1 == NULL) return t2;
          if (t2 == NULL) return t1;
          // 重新定义新的节点，不修改原有两个树的结构
          TreeNode* root = new TreeNode(0);
          root->val = t1->val + t2->val;
          root->left = mergeTrees(t1->left, t2->left);
          root->right = mergeTrees(t1->right, t2->right);
          return root;
      }
  };
  ```

- 迭代方法

  ```cpp
  class Solution {
  public:
      TreeNode* mergeTrees(TreeNode* t1, TreeNode* t2) {
          if (t1 == NULL) return t2;
          if (t2 == NULL) return t1;
          queue<TreeNode*> que;
          que.push(t1);
          que.push(t2);
          while(!que.empty()) {
              TreeNode* node1 = que.front(); que.pop();
              TreeNode* node2 = que.front(); que.pop();
              // 此时两个节点一定不为空，val相加
              node1->val += node2->val;

              // 如果两棵树左节点都不为空，加入队列
              if (node1->left != NULL && node2->left != NULL) {
                  que.push(node1->left);
                  que.push(node2->left);
              }
              // 如果两棵树右节点都不为空，加入队列
              if (node1->right != NULL && node2->right != NULL) {
                  que.push(node1->right);
                  que.push(node2->right);
              }

              // 当t1的左节点 为空 t2左节点不为空，就赋值过去
              if (node1->left == NULL && node2->left != NULL) {
                  node1->left = node2->left;
              }
              // 当t1的右节点 为空 t2右节点不为空，就赋值过去
              if (node1->right == NULL && node2->right != NULL) {
                  node1->right = node2->right;
              }
          }
          return t1;
      }
  };
  ```

- 参考题目
  - [617. 合并二叉树](https://leetcode.cn/problems/merge-two-binary-trees/)

### 最近公共祖先

- 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先

- 最近公共祖先的定义为：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）

- 显然，如果能够自底向上查找，就可以找到公共祖先了，那么应该如何自底向上查找？可以使用回溯，而后序遍历就是天然地回溯过程，可以根据左右子树的返回值，来处理中节点的逻辑

- 代码实现

  ```cpp
  class Solution {
  public:
      TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
          if (root == q || root == p || root == NULL) return root;
          TreeNode* left = lowestCommonAncestor(root->left, p, q);
          TreeNode* right = lowestCommonAncestor(root->right, p, q);
          if (left != NULL && right != NULL) return root;
          if (left == NULL) return right;
          return left;
      }
  };
  ```

- 这个函数的作用是：在以 node 为根的子树里，能不能找到 p 或 q？能找到就返回它，找不到返回 null

- 归纳如下三点
  - 求最小公共祖先，需要从底向上遍历，那么二叉树，只能通过后序遍历（即：回溯）实现从底向上的遍历方式
  - 在回溯的过程中，必然要遍历整棵二叉树，即使已经找到结果了，依然要把其他节点遍历完，因为要使用递归函数的返回值（也就是代码中的 left 和 right）做逻辑判断
  - 要理解如果返回值 left 为空，right 不为空为什么要返回 right，为什么可以用返回 right 传给上一层结果

- 参考题目
  - [236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)
  - [2096. 从二叉树一个节点到另一个节点每一步的方向](https://leetcode.cn/problems/step-by-step-directions-from-a-binary-tree-node-to-another/description/)
  - [2509. 查询树中环的长度](https://leetcode.cn/problems/cycle-length-queries-in-a-tree/)

## 二叉搜索树

### 搜索

- 给定二叉搜索树（BST）的根节点和一个值。 你需要在BST中找到节点值等于给定值的节点。 返回以该节点为根的子树。 如果节点不存在，则返回 NULL

- 二叉搜索树是一个有序树：
  - 若它的左子树不空，则左子树上所有结点的值均小于它的根结点的值；
  - 若它的右子树不空，则右子树上所有结点的值均大于它的根结点的值；
  - 它的左、右子树也分别为二叉搜索树

- 代码实现

  ```cpp
  class Solution {
  public:
      TreeNode* searchBST(TreeNode* root, int val) {
          if (root == NULL || root->val == val) return root;
          if (root->val > val) return searchBST(root->left, val);
          if (root->val < val) return searchBST(root->right, val);
          return NULL;
      }
  };
  ```

- 对于二叉搜索树，不需要回溯的过程，因为节点的有序性帮助确定了搜索的方向，其迭代法如下

  ```cpp
  class Solution {
  public:
      TreeNode* searchBST(TreeNode* root, int val) {
          while (root != NULL) {
              if (root->val > val) root = root->left;
              else if (root->val < val) root = root->right;
              else return root;
          }
          return NULL;
      }
  };
  ```

### 验证二叉搜索树

- 给定一个二叉树，判断其是否是一个有效的二叉搜索树

- 递归法（将二叉树转换为数组判断）

  ```cpp
  class Solution {
  private:
      vector<int> vec;
      void traversal(TreeNode* root) {
          if (root == NULL) return;
          traversal(root->left);
          vec.push_back(root->val); // 将二叉搜索树转换为有序数组
          traversal(root->right);
      }
  public:
      bool isValidBST(TreeNode* root) {
          vec.clear(); // 不加这句在leetcode上也可以过，但最好加上
          traversal(root);
          for (int i = 1; i < vec.size(); i++) {
              // 注意要小于等于，搜索树里不能有相同元素
              if (vec[i] <= vec[i - 1]) return false;
          }
          return true;
      }
  };
  ```

- 在不借助数组，直接判断时，注意要比较的是左子树所有节点小于中间节点，右子树所有节点大于中间节点

- 以下是中序遍历的递归法判断，这是由于二叉搜索树的中序遍历结果是严格递增的，因此可以用一个全局变量 maxVal 记录遍历过程中遇到的最大值；先递归遍历左子树，再检查当前节点值是否大于 maxVal（保证递增），最后递归遍历右子树；若所有节点都满足 “当前值> 之前最大值”，则是合法 BST

  ```cpp
  class Solution {
  public:
      bool isValidBST(TreeNode* root) {
          long long maxVal = LONG_MIN; // 每次调用都重新初始化，避免残留值
          return inorderCheck(root, maxVal);
      }

  private:
      // 辅助函数：传引用维护maxVal，避免成员变量的副作用
      bool inorderCheck(TreeNode* node, long long& maxVal) {
          if (node == nullptr) return true;

          // 1. 递归检查左子树
          bool leftValid = inorderCheck(node->left, maxVal);
          if (!leftValid) return false; // 左子树不合法，直接返回

          // 2. 中序遍历核心：
          if (node->val <= maxVal) return false;
          maxVal = node->val; // 更新最大值为当前节点值

          // 3. 递归检查右子树
          bool rightValid = inorderCheck(node->right, maxVal);
          return rightValid;
        }
  };
  ```

- 上下界递归法（前序）

  ```cpp
  class Solution {
  public:
      bool isValidBST(TreeNode* root) {
          // 初始范围：下界为long long最小值（避免int最小值溢出），上界为long long最大值
          return helper(root, LLONG_MIN, LLONG_MAX);
      }

  private:
      // 辅助递归函数：验证节点是否在 [lower, upper] 开区间内（即严格大于lower，严格小于upper）
      bool helper(TreeNode* node, long long lower, long long upper) {
          // 空节点是合法的BST
          if (node == nullptr) {
              return true;
          }

          // 核心检查：当前节点值超出上下界 → 非法BST
          if (node->val <= lower || node->val >= upper) {
              return false;
          }

          // 递归检查左子树：左子树的上界更新为当前节点值，下界不变
          bool leftValid = helper(node->left, lower, node->val);
          // 递归检查右子树：右子树的下界更新为当前节点值，上界不变
          bool rightValid = helper(node->right, node->val, upper);

          // 左右子树都合法，当前树才合法
          return leftValid && rightValid;
      }
  };
  ```

- 迭代法（中序）

  ```cpp
  class Solution {
  public:
      bool isValidBST(TreeNode* root) {
          stack<TreeNode*> st;
          TreeNode* cur = root;
          TreeNode* pre = NULL; // 记录前一个节点
          while (cur != NULL || !st.empty()) {
              if (cur != NULL) {
                  st.push(cur);
                  cur = cur->left;                // 左
              } else {
                  cur = st.top();                 // 中
                  st.pop();
                  if (pre != NULL && cur->val <= pre->val)
                  return false;
                  pre = cur; //保存前一个访问的结点

                  cur = cur->right;               // 右
              }
          }
          return true;
      }
  };
  ```

- 相关题目
  - [98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)
  - [501. 二叉搜索树中的众数](https://leetcode.cn/problems/find-mode-in-binary-search-tree/)
  - [94. 二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/description/)

### 最小绝对差

- 给定一棵所有节点为非负值的二叉搜索树，计算树中任意两节点的差的绝对值的最小值

- 遇到在二叉搜索树上求最值/差值，可以想象成在一个有序数组上求最值/差值

- 递归：先转换为有序数组，然后遍历数组求最小差值

  ```cpp
  class Solution {
  private:
  vector<int> vec;
  void traversal(TreeNode* root) {
      if (root == NULL) return;
      traversal(root->left);
      vec.push_back(root->val); // 将二叉搜索树转换为有序数组
      traversal(root->right);
  }
  public:
      int getMinimumDifference(TreeNode* root) {
          vec.clear();
          traversal(root);
          if (vec.size() < 2) return 0;
          int result = INT_MAX;
          for (int i = 1; i < vec.size(); i++) { // 统计有序数组的最小差值
              result = min(result, vec[i] - vec[i-1]);
          }
          return result;
      }
  };
  ```

- 递归：用 pre 指针记录 cur 节点的前一个节点，来计算当前的最小绝对差

  ```cpp
  class Solution {
  private:
  int result = INT_MAX;
  TreeNode* pre = NULL;
  void traversal(TreeNode* cur) {
      if (cur == NULL) return;
      traversal(cur->left);   // 左
      if (pre != NULL){       // 中
          result = min(result, cur->val - pre->val);
      }
      pre = cur; // 记录前一个
      traversal(cur->right);  // 右
  }
  public:
      int getMinimumDifference(TreeNode* root) {
          traversal(root);
          return result;
      }
  };
  ```

- 迭代法

  ```cpp
  class Solution {
  public:
      int getMinimumDifference(TreeNode* root) {
          stack<TreeNode*> st;
          TreeNode* cur = root;
          TreeNode* pre = NULL;
          int result = INT_MAX;
          while (cur != NULL || !st.empty()) {
              if (cur != NULL) { // 指针来访问节点，访问到最底层
                  st.push(cur); // 将访问的节点放进栈
                  cur = cur->left;                // 左
              } else {
                  cur = st.top();
                  st.pop();
                  if (pre != NULL) {              // 中
                      result = min(result, cur->val - pre->val);
                  }
                  pre = cur;
                  cur = cur->right;               // 右
              }
          }
          return result;
      }
  };
  ```

- 相关题目
  - [530. 二叉搜索树的最小绝对差](https://leetcode.cn/problems/minimum-absolute-difference-in-bst/)
  - [532. 数组中的 k-diff 数对](https://leetcode.cn/problems/k-diff-pairs-in-an-array/)

### 众数

- 给定一个有相同值的二叉搜索树（BST），找出 BST 中的所有众数（出现频率最高的元素）；要求不使用额外的空间，如果众数超过 1 个，不需考虑输出顺序

- 如果不是二叉搜索树，应该怎么处理？遍历整个数，用 map 统计频率

  ```cpp
  class Solution {
  private:

  void searchBST(TreeNode* cur, unordered_map<int, int>& map) { // 前序遍历
      if (cur == NULL) return ;
      map[cur->val]++; // 统计元素频率
      searchBST(cur->left, map);
      searchBST(cur->right, map);
      return ;
  }
  bool static cmp (const pair<int, int>& a, const pair<int, int>& b) {
      return a.second > b.second;
  }
  public:
      vector<int> findMode(TreeNode* root) {
          unordered_map<int, int> map; // key:元素，value:出现频率
          vector<int> result;
          if (root == NULL) return result;
          searchBST(root, map);
          vector<pair<int, int>> vec(map.begin(), map.end());
          sort(vec.begin(), vec.end(), cmp); // 给频率排个序
          result.push_back(vec[0].first);
          for (int i = 1; i < vec.size(); i++) {
              // 取最高的放到result数组中
              if (vec[i].second == vec[0].second) result.push_back(vec[i].first);
              else break;
          }
          return result;
      }
  };
  ```

- 那么如何利用二叉搜索树的性质？

  ```cpp
  class Solution {
  private:
      int maxCount = 0; // 最大频率
      int count = 0; // 统计频率
      TreeNode* pre = NULL;
      vector<int> result;
      void searchBST(TreeNode* cur) {
          if (cur == NULL) return ;

          searchBST(cur->left);       // 左
                                      // 中
          if (pre == NULL) { // 第一个节点
              count = 1;
          } else if (pre->val == cur->val) { // 与前一个节点数值相同
              count++;
          } else { // 与前一个节点数值不同
              count = 1;
          }
          pre = cur; // 更新上一个节点

          if (count == maxCount) { // 如果和最大值相同，放进result中
              result.push_back(cur->val);
          }

          if (count > maxCount) { // 如果计数大于最大值频率
              maxCount = count;   // 更新最大频率
              result.clear();     // 很关键的一步，不要忘记清空result，之前result里的元素都失效了
              result.push_back(cur->val);
          }

          searchBST(cur->right);      // 右
          return ;
      }

  public:
      vector<int> findMode(TreeNode* root) {
          count = 0;
          maxCount = 0;
          pre = NULL; // 记录前一个节点
          result.clear();

          searchBST(root);
          return result;
      }
  };
  ```

- 迭代法

  ```cpp
  class Solution {
  public:
      vector<int> findMode(TreeNode* root) {
          stack<TreeNode*> st;
          TreeNode* cur = root;
          TreeNode* pre = NULL;
          int maxCount = 0; // 最大频率
          int count = 0; // 统计频率
          vector<int> result;
          while (cur != NULL || !st.empty()) {
              if (cur != NULL) { // 指针来访问节点，访问到最底层
                  st.push(cur); // 将访问的节点放进栈
                  cur = cur->left;                // 左
              } else {
                  cur = st.top();
                  st.pop();                       // 中
                  if (pre == NULL) { // 第一个节点
                      count = 1;
                  } else if (pre->val == cur->val) { // 与前一个节点数值相同
                      count++;
                  } else { // 与前一个节点数值不同
                      count = 1;
                  }
                  if (count == maxCount) { // 如果和最大值相同，放进result中
                      result.push_back(cur->val);
                  }

                  if (count > maxCount) { // 如果计数大于最大值频率
                      maxCount = count;   // 更新最大频率
                      result.clear();     // 很关键的一步，不要忘记清空result，之前result里的元素都失效了
                      result.push_back(cur->val);
                  }
                  pre = cur;
                  cur = cur->right;               // 右
              }
          }
          return result;
      }
  };
  ```

- 参考题目
  - [501. 二叉搜索树中的众数](https://leetcode.cn/problems/find-mode-in-binary-search-tree/description/)

### 最近公共祖先

- 给定一个二叉搜索树, 找到该树中两个指定节点的最近公共祖先

- 因为二叉搜索树是有序的，因此如果中间节点是 q 和 p 的公共祖先，那么中间节点的数组一定是在 [p,q] 区间的

- 递归法

  ```cpp
  class Solution {
  public:
      TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
          if (root->val > p->val && root->val > q->val) {
              return lowestCommonAncestor(root->left, p, q);
          } else if (root->val < p->val && root->val < q->val) {
              return lowestCommonAncestor(root->right, p, q);
          } else return root;
      }
  };
  ```

- 迭代法

  ```cpp
  class Solution {
  public:
      TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
          while(root) {
              if (root->val > p->val && root->val > q->val) {
                  root = root->left;
              } else if (root->val < p->val && root->val < q->val) {
                  root = root->right;
              } else return root;
          }
          return NULL;
      }
  };
  ```

- 参考题目
  - [235. 二叉搜索树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/description/)

### 插入节点

- 给定二叉搜索树（BST）的根节点和要插入树中的值，将值插入二叉搜索树。 返回插入后二叉搜索树的根节点

- 输入数据保证，新值和原始二叉搜索树中的任意节点值都不同

  ```cpp
  class Solution {
  private:
      TreeNode* parent;
      void traversal(TreeNode* cur, int val) {
          if (cur == NULL) {
              TreeNode* node = new TreeNode(val);
              if (val > parent->val) parent->right = node;
              else parent->left = node;
              return;
          }
          parent = cur;
          if (cur->val > val) traversal(cur->left, val);
          if (cur->val < val) traversal(cur->right, val);
          return;
      }

  public:
      TreeNode* insertIntoBST(TreeNode* root, int val) {
          parent = new TreeNode(0);
          if (root == NULL) {
              root = new TreeNode(val);
          }
          traversal(root, val);
          return root;
      }
  };
  ```

- 迭代法

  ```cpp
  class Solution {
  public:
      TreeNode* insertIntoBST(TreeNode* root, int val) {
          if (root == NULL) {
              TreeNode* node = new TreeNode(val);
              return node;
          }
          TreeNode* cur = root;
          TreeNode* parent = root; // 这个很重要，需要记录上一个节点，否则无法赋值新节点
          while (cur != NULL) {
              parent = cur;
              if (cur->val > val) cur = cur->left;
              else cur = cur->right;
          }
          TreeNode* node = new TreeNode(val);
          if (val < parent->val) parent->left = node;// 此时是用parent节点的进行赋值
          else parent->right = node;
          return root;
      }
  };
  ```

- 参考题目
  - [701. 二叉搜索树中的插入操作](https://leetcode.cn/problems/insert-into-a-binary-search-tree/)

### 删除节点

- 给定一个二叉搜索树的根节点 root 和一个值 key，删除二叉搜索树中的 key 对应的节点，并保证二叉搜索树的性质不变；返回二叉搜索树（有可能被更新）的根节点的引用

- 要求算法时间复杂度为 $O(h)$​，h 为树的高度

- 删除节点有以下五种情况：
  - 第一种情况：没找到删除的节点，遍历到空节点直接返回了
  - 找到删除的节点
    - 第二种情况：左右孩子都为空（叶子节点），直接删除节点， 返回NULL为根节点
    - 第三种情况：删除节点的左孩子为空，右孩子不为空，删除节点，右孩子补位，返回右孩子为根节点
    - 第四种情况：删除节点的右孩子为空，左孩子不为空，删除节点，左孩子补位，返回左孩子为根节点
    - 第五种情况：左右孩子节点都不为空，则将删除节点的左子树头结点（左孩子）放到删除节点的右子树的最左面节点的左孩子上，返回删除节点右孩子为新的根节点

- 示例代码

  ```cpp
  class Solution {
  public:
      TreeNode* deleteNode(TreeNode* root, int key) {
          if (root == nullptr) return root; // 第一种情况：没找到删除的节点，遍历到空节点直接返回了
          if (root->val == key) {
              // 第二种情况：左右孩子都为空（叶子节点），直接删除节点， 返回NULL为根节点
              if (root->left == nullptr && root->right == nullptr) {
                  ///! 内存释放
                  delete root;
                  return nullptr;
              }
              // 第三种情况：其左孩子为空，右孩子不为空，删除节点，右孩子补位 ，返回右孩子为根节点
              else if (root->left == nullptr) {
                  auto retNode = root->right;
                  ///! 内存释放
                  delete root;
                  return retNode;
              }
              // 第四种情况：其右孩子为空，左孩子不为空，删除节点，左孩子补位，返回左孩子为根节点
              else if (root->right == nullptr) {
                  auto retNode = root->left;
                  ///! 内存释放
                  delete root;
                  return retNode;
              }
              // 第五种情况：左右孩子节点都不为空，则将删除节点的左子树放到删除节点的右子树的最左面节点的左孩子的位置
              // 并返回删除节点右孩子为新的根节点。
              else {
                  TreeNode* cur = root->right; // 找右子树最左面的节点
                  while(cur->left != nullptr) {
                      cur = cur->left;
                  }
                  cur->left = root->left; // 把要删除的节点（root）左子树放在cur的左孩子的位置
                  TreeNode* tmp = root;   // 把root节点保存一下，下面来删除
                  root = root->right;     // 返回旧root的右孩子作为新root
                  delete tmp;             // 释放节点内存（这里不写也可以，但C++最好手动释放一下吧）
                  return root;
              }
          }
          if (root->val > key) root->left = deleteNode(root->left, key);
          if (root->val < key) root->right = deleteNode(root->right, key);
          return root;
      }
  };
  ```

- 普通二叉树的删除节点

  ```cpp
  class Solution {
  public:
      TreeNode* deleteNode(TreeNode* root, int key) {
          if (root == nullptr) return root;
          if (root->val == key) {
              if (root->right == nullptr) { // 这里第二次操作目标值：最终删除的作用
                  return root->left;
              }
              TreeNode *cur = root->right;
              while (cur->left) {
                  cur = cur->left;
              }
              swap(root->val, cur->val); // 这里第一次操作目标值：交换目标值其右子树最左面节点。
          }
          root->left = deleteNode(root->left, key);
          root->right = deleteNode(root->right, key);
          return root;
      }
  };
  ```

- 迭代法

  ```cpp
  class Solution {
  private:
      // 将目标节点（删除节点）的左子树放到 目标节点的右子树的最左面节点的左孩子位置上
      // 并返回目标节点右孩子为新的根节点
      // 是动画里模拟的过程
      TreeNode* deleteOneNode(TreeNode* target) {
          if (target == nullptr) return target;
          if (target->right == nullptr) return target->left;
          TreeNode* cur = target->right;
          while (cur->left) {
              cur = cur->left;
          }
          cur->left = target->left;
          return target->right;
      }
  public:
      TreeNode* deleteNode(TreeNode* root, int key) {
          if (root == nullptr) return root;
          TreeNode* cur = root;
          TreeNode* pre = nullptr; // 记录cur的父节点，用来删除cur
          while (cur) {
              if (cur->val == key) break;
              pre = cur;
              if (cur->val > key) cur = cur->left;
              else cur = cur->right;
          }
          if (pre == nullptr) { // 如果搜索树只有头结点
              return deleteOneNode(cur);
          }
          // pre 要知道是删左孩子还是右孩子
          if (pre->left && pre->left->val == key) {
              pre->left = deleteOneNode(cur);
          }
          if (pre->right && pre->right->val == key) {
              pre->right = deleteOneNode(cur);
          }
          return root;
      }
  };
  ```

- 参考题目
  - [450. 删除二叉搜索树中的节点](https://leetcode.cn/problems/delete-node-in-a-bst/description/)

### 修建二叉搜索树

- 给定一个二叉搜索树，同时给定最小边界 L 和最大边界 R。通过修剪二叉搜索树，使得所有节点的值在 [L, R] 中 (R>=L)

- 你可能需要改变树的根节点，所以结果应当返回修剪好的二叉搜索树的新的根节点

- 递归法：遇到不在区间内的，将其左子树或右子树接到 root 上

- 示例代码

  ```cpp
  class Solution {
  public:
      TreeNode* trimBST(TreeNode* root, int low, int high) {
          if (root == nullptr ) return nullptr;
          if (root->val < low) {
              TreeNode* right = trimBST(root->right, low, high); // 寻找符合区间[low, high]的节点
              return right;
          }
          if (root->val > high) {
              TreeNode* left = trimBST(root->left, low, high); // 寻找符合区间[low, high]的节点
              return left;
          }
          root->left = trimBST(root->left, low, high); // root->left接入符合条件的左孩子
          root->right = trimBST(root->right, low, high); // root->right接入符合条件的右孩子
          return root;
      }
  };
  ```

- 迭代法

  ```cpp
  class Solution {
  public:
      TreeNode* trimBST(TreeNode* root, int L, int R) {
          if (!root) return nullptr;

          // 处理头结点，让root移动到[L, R] 范围内，注意是左闭右闭
          while (root != nullptr && (root->val < L || root->val > R)) {
              if (root->val < L) root = root->right; // 小于L往右走
              else root = root->left; // 大于R往左走
          }
          TreeNode *cur = root;
          // 此时root已经在[L, R] 范围内，处理左孩子元素小于L的情况
          while (cur != nullptr) {
              while (cur->left && cur->left->val < L) {
                  cur->left = cur->left->right;
              }
              cur = cur->left;
          }
          cur = root;

          // 此时root已经在[L, R] 范围内，处理右孩子大于R的情况
          while (cur != nullptr) {
              while (cur->right && cur->right->val > R) {
                  cur->right = cur->right->left;
              }
              cur = cur->right;
          }
          return root;
      }
  };
  ```

- 参考题目
  - [669. 修剪二叉搜索树](https://leetcode.cn/problems/trim-a-binary-search-tree/description/)

### 有序数组转换为二叉搜索树

- 将一个按照升序排列的有序数组，转换为一棵高度平衡二叉搜索树

- 一个高度平衡二叉树是指一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1

- 将数组分为两半，分别构造左右子树

- 递归法

  ```cpp
  class Solution {
  private:
      TreeNode* traversal(vector<int>& nums, int left, int right) {
          if (left > right) return nullptr;
          int mid = left + ((right - left) / 2);
          TreeNode* root = new TreeNode(nums[mid]);
          root->left = traversal(nums, left, mid - 1);
          root->right = traversal(nums, mid + 1, right);
          return root;
      }
  public:
      TreeNode* sortedArrayToBST(vector<int>& nums) {
          TreeNode* root = traversal(nums, 0, nums.size() - 1);
          return root;
      }
  };
  ```

- 迭代法

  ```cpp
  class Solution {
  public:
      TreeNode* sortedArrayToBST(vector<int>& nums) {
          if (nums.size() == 0) return nullptr;

          TreeNode* root = new TreeNode(0);   // 初始根节点
          queue<TreeNode*> nodeQue;           // 放遍历的节点
          queue<int> leftQue;                 // 保存左区间下标
          queue<int> rightQue;                // 保存右区间下标
          nodeQue.push(root);                 // 根节点入队列
          leftQue.push(0);                    // 0为左区间下标初始位置
          rightQue.push(nums.size() - 1);     // nums.size() - 1为右区间下标初始位置

          while (!nodeQue.empty()) {
              TreeNode* curNode = nodeQue.front();
              nodeQue.pop();
              int left = leftQue.front(); leftQue.pop();
              int right = rightQue.front(); rightQue.pop();
              int mid = left + ((right - left) / 2);

              curNode->val = nums[mid];       // 将mid对应的元素给中间节点

              if (left <= mid - 1) {          // 处理左区间
                  curNode->left = new TreeNode(0);
                  nodeQue.push(curNode->left);
                  leftQue.push(left);
                  rightQue.push(mid - 1);
              }

              if (right >= mid + 1) {         // 处理右区间
                  curNode->right = new TreeNode(0);
                  nodeQue.push(curNode->right);
                  leftQue.push(mid + 1);
                  rightQue.push(right);
              }
          }
          return root;
      }
  };
  ```

- 参考题目
  - [108. 将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/description/)
  - [109. 有序链表转换二叉搜索树](https://leetcode.cn/problems/convert-sorted-list-to-binary-search-tree/description/)

### 把二叉搜索树转换为累加树

- 给出二叉搜索树的根节点，该树的节点值各不相同，将其转换为累加树（Greater Sum Tree），使每个节点 node 的新值等于原树中大于或等于 node.val 的值之和

- 递归法

  ```cpp
  class Solution {
  private:
      int pre = 0; // 记录前一个节点的数值
      void traversal(TreeNode* cur) { // 右中左遍历
          if (cur == NULL) return;
          traversal(cur->right);
          cur->val += pre;
          pre = cur->val;
          traversal(cur->left);
      }
  public:
      TreeNode* convertBST(TreeNode* root) {
          pre = 0;
          traversal(root);
          return root;
      }
  };
  ```

- 迭代法

  ```cpp
  class Solution {
  private:
      int pre; // 记录前一个节点的数值
      void traversal(TreeNode* root) {
          stack<TreeNode*> st;
          TreeNode* cur = root;
          while (cur != NULL || !st.empty()) {
              if (cur != NULL) {
                  st.push(cur);
                  cur = cur->right;   // 右
              } else {
                  cur = st.top();     // 中
                  st.pop();
                  cur->val += pre;
                  pre = cur->val;
                  cur = cur->left;    // 左
              }
          }
      }
  public:
      TreeNode* convertBST(TreeNode* root) {
          pre = 0;
          traversal(root);
          return root;
      }
  };
  ```

- 相关题目
  - [538. 把二叉搜索树转换为累加树](https://leetcode.cn/problems/convert-bst-to-greater-tree/description/)

## 堆

### 基本思想

- 优先队列（Priority Queue）是一种特殊的队列，区别于普通队列 “先进先出（FIFO）” 的规则，它的核心特征是「队列中的元素按优先级排序，出队时总是优先级最高的元素先出」

- 优先队列：出队顺序 = 优先级高低（与入队顺序无关），优先级可自定义（比如数值大小、字典序等）

- 优先队列的底层实现有多种方式，但堆（Heap）是最优选择（时间复杂度更优）

- 堆是一种完全二叉树，主要分为两种：
  - 最大堆：每个父节点的值都大于或等于其子节点的值
  - 最小堆：每个父节点的值都小于或等于其子节点的值

- 通常用数组来存储堆（因为完全二叉树的数组存储效率最高），数组索引的对应关系（对于索引为 `i`的节点）：
  - 左子节点索引：`2*i + 1`
  - 右子节点索引：`2*i + 2`
  - 父节点索引：`(i - 1) / 2`（整数除法）

### 大顶堆

- 实现堆的关键操作有 3 个：
  - 上浮（sift up）
    - 插入新元素后，新元素在数组末尾，可能破坏堆性质，需要向上 “浮” 到正确位置
    - 不断比较当前节点和父节点，若当前节点更大（最大堆），则交换，直到满足堆性质或到达根节点
  - 下沉（sift down）
    - 删除堆顶后，用最后一个元素替代堆顶，需要向下 “沉” 到正确位置；堆化时也需要此操作
    - 找到当前节点的左右子节点中的最大值，若最大值比当前节点大，则交换，直到满足堆性质或到达叶子节点
  - 堆化（heapify）
    - 将一个普通数组转换为堆，不需要从第一个元素开始逐个插入（时间复杂度为 $O(n\log n)$），而是从最后一个非叶子节点开始向前逐个下沉，时间复杂度为 $O(n)$
    - 最后一个非叶子节点索引：`n/2-1`（n 是数组长度）
  - 插入 / 删除操作
    - 插入：先追加到数组末尾，再上浮
    - 删除堆顶：用最后一个元素覆盖堆顶，删除最后一个元素，再对堆顶下沉

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <stdexcept> // 用于异常处理

  // 最大堆（大顶堆）类
  class MaxHeap {
  private:
      std::vector<int> heap; // 存储堆的数组

      // 核心操作1：上浮 - 从索引i开始向上调整，恢复堆性质
      void siftUp(int i) {
          // 当不是根节点，且当前节点值大于父节点值时，交换
          while (i > 0) {
              int parent = (i - 1) / 2; // 父节点索引
              if (heap[i] <= heap[parent]) {
                  break; // 满足最大堆性质，停止调整
              }
              // 交换当前节点和父节点
              std::swap(heap[i], heap[parent]);
              i = parent; // 继续向上检查
          }
      }

      // 核心操作2：下沉 - 从索引i开始向下调整，恢复堆性质
      void siftDown(int i) {
          int n = heap.size();
          while (true) {
              int maxIndex = i; // 初始化最大值索引为当前节点
              int left = 2 * i + 1;  // 左子节点
              int right = 2 * i + 2; // 右子节点

              // 比较左子节点
              if (left < n && heap[left] > heap[maxIndex]) {
                  maxIndex = left;
              }
              // 比较右子节点
              if (right < n && heap[right] > heap[maxIndex]) {
                  maxIndex = right;
              }

              // 如果最大值就是当前节点，说明堆性质已满足
              if (maxIndex == i) {
                  break;
              }

              // 交换当前节点和最大值节点
              std::swap(heap[i], heap[maxIndex]);
              i = maxIndex; // 继续向下检查
          }
      }

  public:
      // 构造函数1：空堆
      MaxHeap() = default;

      // 构造函数2：将普通数组堆化
      MaxHeap(const std::vector<int>& arr) {
          heap = arr; // 先复制数组
          int n = heap.size();
          // 从最后一个非叶子节点开始，向前逐个下沉
          // 最后一个非叶子节点索引：(n-1-1)/2 = n/2 - 1
          for (int i = n / 2 - 1; i >= 0; --i) {
              siftDown(i);
          }
      }

      // 插入元素
      void insert(int val) {
          heap.push_back(val); // 先把元素加到数组末尾
          siftUp(heap.size() - 1); // 对最后一个元素上浮调整
      }

      // 删除堆顶元素（最大值）
      void removeMax() {
          if (heap.empty()) {
              throw std::out_of_range("Heap is empty!");
          }
          // 把最后一个元素放到堆顶，然后删除最后一个元素
          heap[0] = heap.back();
          heap.pop_back();
          // 对堆顶元素下沉调整
          if (!heap.empty()) {
              siftDown(0);
          }
      }

      // 获取堆顶元素（最大值）
      int getMax() const {
          if (heap.empty()) {
              throw std::out_of_range("Heap is empty!");
          }
          return heap[0];
      }

      // 获取堆的大小
      int size() const {
          return heap.size();
      }

      // 判断堆是否为空
      bool isEmpty() const {
          return heap.empty();
      }

      // 打印堆的数组形式
      void printHeap() const {
          for (int num : heap) {
              std::cout << num << " ";
          }
          std::cout << std::endl;
      }
  };

  // 测试代码
  int main() {
      // 测试1：空堆插入元素
      MaxHeap heap1;
      heap1.insert(5);
      heap1.insert(3);
      heap1.insert(8);
      heap1.insert(1);
      std::cout << "堆1的元素：";
      heap1.printHeap(); // 输出：8 3 5 1（符合最大堆性质）
      std::cout << "堆1的最大值：" << heap1.getMax() << std::endl; // 8

      // 测试2：删除堆顶
      heap1.removeMax();
      std::cout << "删除最大值后堆1的元素：";
      heap1.printHeap(); // 输出：5 3 1
      std::cout << "删除后堆1的最大值：" << heap1.getMax() << std::endl; // 5

      // 测试3：数组堆化
      std::vector<int> arr = {4, 1, 3, 2, 16, 9, 10, 14, 8, 7};
      MaxHeap heap2(arr);
      std::cout << "数组堆化后的堆2：";
      heap2.printHeap(); // 输出：16 14 10 8 7 9 3 2 4 1（最大堆）

      return 0;
  }
  ```

- 使用 C++ 的 STL 来使用大顶堆

  ```cpp
  #include <iostream>
  #include <vector>
  #include <algorithm> // 包含堆操作的核心函数

  int main() {
      // ===================== 1. 初始化并创建大顶堆 =====================
      std::vector<int> nums = {4, 1, 3, 2, 16, 9, 10, 14, 8, 7};

      // 将普通vector堆化为大顶堆（STL默认就是大顶堆）
      std::make_heap(nums.begin(), nums.end());
      std::cout << "初始大顶堆（数组形式）：";
      for (int num : nums) {
          std::cout << num << " ";
      }
      std::cout << "\n堆顶元素（最大值）：" << nums.front() << "\n" << std::endl; // 堆顶始终是第一个元素

      // ===================== 2. 向堆中插入元素 =====================
      int newVal = 18;
      nums.push_back(newVal); // 先把元素加到容器末尾
      std::push_heap(nums.begin(), nums.end()); // 调整为大顶堆
      std::cout << "插入元素 " << newVal << " 后的大顶堆：";
      for (int num : nums) {
          std::cout << num << " ";
      }
      std::cout << "\n新堆顶元素：" << nums.front() << "\n" << std::endl;

      // ===================== 3. 删除堆顶元素（最大值） =====================
      std::pop_heap(nums.begin(), nums.end()); // 把堆顶元素交换到容器末尾，并调整剩余元素为大顶堆
      nums.pop_back(); // 从容器中删除末尾的原堆顶元素
      std::cout << "删除堆顶后的大顶堆：";
      for (int num : nums) {
          std::cout << num << " ";
      }
      std::cout << "\n删除后堆顶元素：" << nums.front() << "\n" << std::endl;

      // ===================== 4. 其他常用操作 =====================
      // 判断是否为合法的堆（STL默认判断大顶堆）
      bool isHeap = std::is_heap(nums.begin(), nums.end());
      std::cout << "当前容器是否为大顶堆：" << (isHeap ? "是" : "否") << std::endl;

      // 堆排序（将堆转换为升序数组，本质是反复弹出堆顶）
      std::sort_heap(nums.begin(), nums.end());
      std::cout << "堆排序后的升序数组：";
      for (int num : nums) {
          std::cout << num << " ";
      }
      std::cout << std::endl;
      // 堆化为小顶堆
      std::make_heap(nums.begin(), nums.end(), std::greater<int>());
      // 插入元素并调整为小顶堆
      std::push_heap(nums.begin(), nums.end(), std::greater<int>());

      return 0;
  }
  ```

- 使用优先队列

  ```cpp
  #include <iostream>
  #include <queue> // 包含 priority_queue
  #include <vector>

  int main() {
      // ===================== 1. 初始化大顶堆（priority_queue默认就是大顶堆） =====================
      // 方式1：空队列，后续插入元素
      std::priority_queue<int> maxHeap1;

      // 插入元素（自动维护大顶堆性质）
      maxHeap1.push(5);
      maxHeap1.push(3);
      maxHeap1.push(8);
      maxHeap1.push(1);

      std::cout << "大顶堆1的堆顶（最大值）：" << maxHeap1.top() << std::endl; // 8
      std::cout << "大顶堆1的大小：" << maxHeap1.size() << std::endl; // 4

      // ===================== 2. 删除堆顶元素 =====================
      maxHeap1.pop(); // 删除堆顶（最大值8）
      std::cout << "删除堆顶后，新堆顶：" << maxHeap1.top() << std::endl; // 5
      std::cout << "删除后大小：" << maxHeap1.size() << std::endl; // 3

      // ===================== 3. 方式2：用数组初始化大顶堆 =====================
      std::vector<int> nums = {4, 1, 3, 2, 16, 9, 10, 14, 8, 7};
      std::priority_queue<int> maxHeap2(nums.begin(), nums.end()); // 直接用数组初始化
      std::cout << "\n数组初始化的大顶堆2堆顶：" << maxHeap2.top() << std::endl; // 16

      // ===================== 4. 遍历堆（注意：priority_queue无迭代器，需弹出遍历） =====================
      std::cout << "大顶堆2的所有元素（从大到小弹出）：";
      while (!maxHeap2.empty()) {
          std::cout << maxHeap2.top() << " ";
          maxHeap2.pop(); // 弹出堆顶后，队列会自动调整
      }
      std::cout << std::endl;

      return 0;
  }
  ```

### 小顶堆

- 小顶堆是堆（优先队列）的一种核心形式，本质是完全二叉树结构，核心特征是「父节点值 ≤ 子节点值」，能以 $O (1)$ 时间获取最小值、$O (\log n)$ 时间插入 / 删除元素，是处理「动态极值」问题的常用工具

- 结构特征
  - 底层是完全二叉树（除最后一层外，每层节点都填满；最后一层节点靠左排列）
  - 核心性质：任意父节点的值 ≤ 其左右子节点的值（小顶堆）；反之，父节点 ≥ 子节点则是「大顶堆」

- 小顶堆的核心价值是「快速获取 / 维护动态数据的最小值」，常见场景：
  - Top K 最大元素：维护大小为 K 的小顶堆，遍历数组时，若元素大于堆顶则替换堆顶，最终堆内就是 Top K 最大元素；
  - 数据流的中位数：结合大顶堆（存左半部分）和小顶堆（存右半部分），动态维护中位数；
  - 合并 K 个有序链表：用小顶堆存储各链表当前节点，每次取堆顶（最小节点），再插入该节点的下一个节点；
  - 任务调度 / 最短路径：如 Dijkstra 算法中，用小顶堆快速找到当前距离最短的节点；
  - 滑动窗口的最小值：也可用于滑动窗口极值（但效率低于单调队列，仅作为备选）

- C++ 中可以直接用 `priority_queue`（优先队列）实现小顶堆（默认是大顶堆，需手动调整）

  ```cpp
  priority_queue<int, vector<int>, greater<int>> minHeap;
  ```

- 手动实现小顶堆

  ```cpp
  #include <iostream>
  #include <vector>
  #include <stdexcept> // 用于异常处理

  // 最小堆（小顶堆）类
  class MinHeap {
  private:
      std::vector<int> heap; // 存储堆的数组

      // 核心操作1：上浮 - 从索引i开始向上调整，恢复堆性质
      void siftUp(int i) {
          // 当不是根节点，且当前节点值小于父节点值时，交换（小顶堆核心区别）
          while (i > 0) {
              int parent = (i - 1) / 2; // 父节点索引
              if (heap[i] >= heap[parent]) {
                  break; // 满足最小堆性质，停止调整
              }
              // 交换当前节点和父节点
              std::swap(heap[i], heap[parent]);
              i = parent; // 继续向上检查
          }
      }

      // 核心操作2：下沉 - 从索引i开始向下调整，恢复堆性质
      void siftDown(int i) {
          int n = heap.size();
          while (true) {
              int minIndex = i; // 初始化最小值索引为当前节点（小顶堆核心区别）
              int left = 2 * i + 1;  // 左子节点
              int right = 2 * i + 2; // 右子节点

              // 比较左子节点（找更小值）
              if (left < n && heap[left] < heap[minIndex]) {
                  minIndex = left;
              }
              // 比较右子节点（找更小值）
              if (right < n && heap[right] < heap[minIndex]) {
                  minIndex = right;
              }

              // 如果最小值就是当前节点，说明堆性质已满足
              if (minIndex == i) {
                  break;
              }

              // 交换当前节点和最小值节点
              std::swap(heap[i], heap[minIndex]);
              i = minIndex; // 继续向下检查
          }
      }

  public:
      // 构造函数1：空堆
      MinHeap() = default;

      // 构造函数2：将普通数组堆化
      MinHeap(const std::vector<int>& arr) {
          heap = arr; // 先复制数组
          int n = heap.size();
          // 从最后一个非叶子节点开始，向前逐个下沉（逻辑和大顶堆一致，只是下沉规则变了）
          // 最后一个非叶子节点索引：(n-1-1)/2 = n/2 - 1
          for (int i = n / 2 - 1; i >= 0; --i) {
              siftDown(i);
          }
      }

      // 插入元素
      void insert(int val) {
          heap.push_back(val); // 先把元素加到数组末尾
          siftUp(heap.size() - 1); // 对最后一个元素上浮调整
      }

      // 删除堆顶元素（最小值）
      void removeMin() {
          if (heap.empty()) {
              throw std::out_of_range("Heap is empty!");
          }
          // 把最后一个元素放到堆顶，然后删除最后一个元素
          heap[0] = heap.back();
          heap.pop_back();
          // 对堆顶元素下沉调整
          if (!heap.empty()) {
              siftDown(0);
          }
      }

      // 获取堆顶元素（最小值）
      int getMin() const {
          if (heap.empty()) {
              throw std::out_of_range("Heap is empty!");
          }
          return heap[0];
      }

      // 获取堆的大小
      int size() const {
          return heap.size();
      }

      // 判断堆是否为空
      bool isEmpty() const {
          return heap.empty();
      }

      // 打印堆的数组形式
      void printHeap() const {
          for (int num : heap) {
              std::cout << num << " ";
          }
          std::cout << std::endl;
      }
  };

  // 测试代码
  int main() {
      // 测试1：空堆插入元素
      MinHeap heap1;
      heap1.insert(5);
      heap1.insert(3);
      heap1.insert(8);
      heap1.insert(1);
      std::cout << "堆1的元素：";
      heap1.printHeap(); // 输出：1 3 8 5（符合小顶堆性质）
      std::cout << "堆1的最小值：" << heap1.getMin() << std::endl; // 1

      // 测试2：删除堆顶
      heap1.removeMin();
      std::cout << "删除最小值后堆1的元素：";
      heap1.printHeap(); // 输出：3 5 8
      std::cout << "删除后堆1的最小值：" << heap1.getMin() << std::endl; // 3

      // 测试3：数组堆化
      std::vector<int> arr = {4, 1, 3, 2, 16, 9, 10, 14, 8, 7};
      MinHeap heap2(arr);
      std::cout << "数组堆化后的堆2：";
      heap2.printHeap(); // 输出：1 2 3 4 7 9 10 14 8 16（小顶堆）

      return 0;
  }
  ```

### 数据流中的第 K 大元素

- 题目：[703. 数据流中的第 K 大元素 - 力扣（LeetCode）](https://leetcode.cn/problems/kth-largest-element-in-a-stream/description/)

- 维护一个最小堆，当压入元素后，堆大小超过 K 时，就要弹出栈顶，这样新的栈顶就是第 K 大元素

- 不要把问题想得更复杂了

  ```cpp
  class KthLargest {
  public:
      priority_queue<int, vector<int>, greater<>> min_heap;
      int k;
      KthLargest(int k, vector<int>& nums) {
          this->k = k;
          for (int num : nums) {
              this->add(num);
          }
      }

      int add(int val) {
          min_heap.push(val);
          if (min_heap.size() > k) {
              min_heap.pop();
          }
          return min_heap.top();
      }
  };
  ```

### 将区间分为最少组数

- 题目：[2406. 将区间分为最少组数 - 力扣（LeetCode）](https://leetcode.cn/problems/divide-intervals-into-minimum-number-of-groups/description/)

- 求最少的组数，等价于某个点的最大重叠数，可以使用差分数组来标记每个点的重叠次数，然后使用前缀和计算最大重叠数

  ```cpp
  class Solution {
  public:
      int minGroups(vector<vector<int>>& intervals) {
          int mx = 0;
          for (vector<int> vec : intervals) {
              mx = max(mx, vec[1]);
          }
          vector<int> diff(mx + 2, 0);
          for (vector<int> vec : intervals) {
              diff[vec[0]]++;
              diff[vec[1] + 1]--;
          }
          int sum = 0;
          int ans = 0;
          for (int i = 0; i < mx + 2; i++) {
              sum += diff[i];
              ans = max(ans, sum);
          }
          return ans;
      }
  };
  ```

- 差分数组的办法在最远右区间过大时，容易内存爆炸；原方法的问题是依赖「连续的下标」来遍历差分，但实际上只有区间的起点和终点 + 1 是关键节点，其他位置的差分都是 0，无需处理，因此可以：
  - 提取所有关键的「事件点」（每个区间的 start 和 end+1）
    - 每个区间 `[start, end]` 拆成两个事件：`(start, +1)`（区间开始，需要新增分组）、`(end+1, -1)`（区间结束，分组可释放）
  - 对事件点排序
    - 优先按位置升序；
    - 位置相同时，`-1`（结束事件）排在 `+1`（开始事件）前面。这是为了处理「区间端点重合」的情况（比如 `[1,2]` 和 `[2,3]` 不算重叠，只需 1 个分组）
  - 按顺序遍历排序后的事件点，计算当前重叠的区间数，最大值即为答案
    - 遍历排序后的事件点，累加变化量得到「当前分组数」，同时记录最大值，这个最大值就是最少需要的分组数

  ```cpp
  #include <vector>
  #include <algorithm>
  using namespace std;

  class Solution {
  public:
      int minGroups(vector<vector<int>>& intervals) {
          // 存储所有事件点：pair<位置, 变化量>，+1 表示区间开始，-1 表示区间结束
          vector<pair<int, int>> events;
          for (auto& vec : intervals) {
              int start = vec[0];
              int end = vec[1];
              events.emplace_back(start, 1);    // 区间开始，重叠数+1
              events.emplace_back(end + 1, -1); // 区间结束的下一个位置，重叠数-1
          }

          // 按位置排序：位置相同时，先处理-1（结束事件），再处理+1（开始事件）
          // 例如 [1,2] 和 [2,3]，2位置先减后加，不会被算作重叠
          sort(events.begin(), events.end(), [](const pair<int, int>& a, const pair<int, int>& b) {
              if (a.first == b.first) {
                  return a.second < b.second; // -1 排在 +1 前面
              }
              return a.first < b.first;
          });

          int current_groups = 0; // 当前需要的分组数
          int max_groups = 0;     // 最大需要的分组数（答案）
          for (auto& event : events) {
              current_groups += event.second;
              max_groups = max(max_groups, current_groups);
          }

          return max_groups;
      }
  };
  ```

- 另一种做法是贪心解法
  - 核心思想是让每个新区间尽可能复用已有的分组，只有当所有分组都无法容纳时，才新建分组
  - 首先将所有区间按左端点升序排序；
  - 使用一个最小堆（优先队列）来维护每个分组的最后一个区间的右端点（堆顶是最小的右端点，代表最容易容纳新区间的分组）；
  - 遍历每个区间：
    - 如果当前区间的左端点 > 堆顶的右端点 → 可以复用这个分组，弹出堆顶，将当前区间的右端点入堆；
    - 如果当前区间的左端点 ≤ 堆顶的右端点 → 无法复用任何分组，新建分组（直接将当前区间的右端点入堆）；
  - 最终堆的大小就是最少需要的分组数

  ```cpp
  #include <vector>
  #include <algorithm>
  #include <queue>
  using namespace std;

  class Solution {
  public:
      int minGroups(vector<vector<int>>& intervals) {
          // 步骤1：按区间左端点升序排序
          sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b) {
              return a[0] < b[0];
          });

          // 步骤2：最小堆，存储各分组的最后一个区间的右端点
          priority_queue<int, vector<int>, greater<int>> min_heap;

          // 步骤3：遍历所有区间，分配分组
          for (auto& interval : intervals) {
              int start = interval[0];
              int end = interval[1];

              // 如果堆不为空，且当前区间能放入堆顶的分组（不重叠）
              if (!min_heap.empty() && start > min_heap.top()) {
                  min_heap.pop(); // 弹出原分组的右端点
              }
              min_heap.push(end); // 放入当前区间的右端点（复用/新建分组）
          }

          // 步骤4：堆的大小就是最少分组数
          return min_heap.size();
      }
  };
  ```

- 也可以使用双指针法来实现贪心算法
  - 核心是将区间的起点和终点分开排序，通过双指针遍历统计重叠数
  - 提取所有区间的左端点到数组 `starts`，右端点到数组 `ends`；
  - 分别对 `starts` 和 `ends` 升序排序；
  - 用两个指针 `i`（遍历 starts）、`j`（遍历 ends），维护当前重叠的区间数：
    - 如果 `starts[i] > ends[j]` → 有一个区间结束，重叠数减 1，`j++`；
    - 否则 → 新增一个重叠区间，重叠数加 1，`i++`；
  - 遍历过程中记录最大重叠数，即为最少分组数

  ```cpp
  #include <vector>
  #include <algorithm>
  using namespace std;

  class Solution {
  public:
      int minGroups(vector<vector<int>>& intervals) {
          vector<int> starts, ends;
          // 步骤1：分离起点和终点
          for (auto& interval : intervals) {
              starts.push_back(interval[0]);
              ends.push_back(interval[1]);
          }

          // 步骤2：分别排序
          sort(starts.begin(), starts.end());
          sort(ends.begin(), ends.end());

          // 步骤3：双指针遍历
          int i = 0, j = 0;
          int current_groups = 0;
          int max_groups = 0;
          int n = intervals.size();

          while (i < n) {
              if (starts[i] > ends[j]) {
                  // 有区间结束，减少分组
                  current_groups--;
                  j++;
              } else {
                  // 新增区间，增加分组
                  current_groups++;
                  max_groups = max(max_groups, current_groups);
                  i++;
              }
          }

          return max_groups;
      }
  };
  ```

- 三种方法的对比

  | 方法       | 核心思想              | 时间复杂度 | 空间复杂度 | 适用场景                    |
  | :--------- | :-------------------- | :--------- | :--------- | :-------------------------- |
  | 差分法     | 区间增减 + 前缀和统计 | O(n + mx)  | O(mx)      | 区间数值范围小（如 mx≤1e5） |
  | 贪心堆解法 | 复用最早结束的分组    | O(n log n) | O(n)       | 任意区间范围，逻辑易理解    |
  | 双指针法   | 端点排序 + 统计重叠数 | O(n log n) | O(n)       | 任意区间范围，代码更简洁    |

### 前 K 个高频元素

- 给定一个非空的整数数组，返回其中出现频率前 k 高的元素，并且需要高效实现

- 优先队列
  - 首先统计频率：用哈希表（unordered_map）统计每个元素的出现次数；
  - 筛选前 k 高频元素：
    - 维护一个大小为 `k` 的小顶堆（优先队列），堆中存储 “元素 - 频率” 对，按频率升序排列；
    - 遍历哈希表时，若堆的大小 <k，直接入堆；若堆的大小 = k，且当前元素频率> 堆顶元素频率，则弹出堆顶，将当前元素入堆；
    - 最终堆中存储的就是频率前 k 高的元素，逆序取出即可（或直接遍历）

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <unordered_map>
  #include <queue>
  using namespace std;

  class Solution {
  public:
      vector<int> topKFrequent(vector<int>& nums, int k) {
          // 步骤1：统计每个元素的频率
          unordered_map<int, int> freq_map;
          for (int num : nums) {
              freq_map[num]++;
          }

          // 步骤2：定义小顶堆（优先队列），排序规则：频率小的优先出队
          // 堆中存储pair<频率, 元素>，默认按第一个元素降序，所以用greater反转成升序
          priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> min_heap;

          // 步骤3：遍历频率表，维护大小为k的小顶堆
          for (auto& pair : freq_map) {
              int num = pair.first;
              int freq = pair.second;

              if (min_heap.size() < k) {
                  // 堆未满，直接入堆
                  min_heap.push({freq, num});
              } else {
                  // 堆已满，若当前频率 > 堆顶频率，替换堆顶
                  if (freq > min_heap.top().first) {
                      min_heap.pop();
                      min_heap.push({freq, num});
                  }
              }
          }

          // 步骤4：提取堆中的元素（前k高频）
          vector<int> result;
          while (!min_heap.empty()) {
              result.push_back(min_heap.top().second);
              min_heap.pop();
          }

          // 可选：反转结果（堆是小顶堆，结果是按频率升序，反转后为降序）
          // reverse(result.begin(), result.end());

          return result;
      }
  };
  ```

- 上述时间复杂度为 $O(n\log k)$，空间复杂度为 $O(k)$

- 桶排序：$O(n)$​ 时间复杂度，$O(n)$ 空间复杂度
  - 统计频率后，创建一个 “频率 - 元素列表” 的数组（桶），索引为频率，值为对应频率的元素列表；
  - 从后往前遍历桶（从最高频率开始），收集元素直到凑够 `k` 个
  - 桶排序的桶数组大小为 $n+1$，而小顶堆方法的堆大小为 $k$；小顶堆更适合 $k$ 较小和对空间消耗敏感的场景

- 代码实现

  ```cpp
  vector<int> topKFrequent(vector<int>& nums, int k) {
      unordered_map<int, int> freq_map;
      for (int num : nums) freq_map[num]++;

      // 桶：索引=频率，值=该频率的元素列表
      vector<vector<int>> bucket(nums.size() + 1);
      for (auto& pair : freq_map) {
          bucket[pair.second].push_back(pair.first);
      }

      // 从高频率往低频率收集元素
      vector<int> result;
      for (int i = bucket.size() - 1; i >= 0 && result.size() < k; --i) {
          for (int num : bucket[i]) {
              result.push_back(num);
              if (result.size() == k) break;
          }
      }
      return result;
  }
  ```

- 可以使用哈希表代替数组存储 “频率 - 元素列表”（本质是稀疏桶），来减少桶排序的空间浪费

  ```cpp
  // 优化版桶排序：用unordered_map代替数组，只存储有值的频率
  unordered_map<int, vector<int>> freq_bucket; // 键=频率，值=元素列表
  int max_freq = 0;
  for (auto& pair : freq_map) {
      freq_bucket[pair.second].push_back(pair.first);
      max_freq = max(max_freq, pair.second); // 记录最大频率
  }

  // 从最大频率开始收集元素
  vector<int> result;
  for (int i = max_freq; i >= 0 && result.size() < k; --i) {
      if (freq_bucket.count(i)) { // 只遍历有值的频率
          for (int num : freq_bucket[i]) {
              result.push_back(num);
              if (result.size() == k) break;
          }
      }
  }
  ```

- 快速选择方法

  ```cpp
  #include <iostream>
  #include <vector>
  #include <unordered_map>
  #include <algorithm>
  using namespace std;

  class Solution {
  private:
      // 分区函数：按频率降序分区，返回基准的最终索引
      int partition(vector<pair<int, int>>& elements, int left, int right) {
          // 选最右侧元素作为基准（频率）
          pair<int, int> pivot = elements[right];
          int pivot_freq = pivot.second;
          int i = left - 1; // 小于等于基准的区域边界

          for (int j = left; j < right; ++j) {
              // 按频率降序排列：当前元素频率 ≥ 基准频率，划入左区
              if (elements[j].second >= pivot_freq) {
                  i++;
                  swap(elements[i], elements[j]);
              }
          }
          // 把基准放到正确位置
          swap(elements[i+1], elements[right]);
          return i + 1;
      }

      // 快速选择递归函数：找前k个高频元素
      void quickSelect(vector<pair<int, int>>& elements, int left, int right, int k) {
          if (left >= right) return;

          // 分区，得到基准的位置
          int pivot_idx = partition(elements, left, right);
          int left_size = pivot_idx - left + 1; // 左区（频率≥基准）的大小

          if (left_size == k) {
              // 左区正好是前k个，直接返回
              return;
          } else if (left_size > k) {
              // 左区超过k个，在左区继续找
              quickSelect(elements, left, pivot_idx - 1, k);
          } else {
              // 左区不足k个，在右区找剩余的k-left_size个
              quickSelect(elements, pivot_idx + 1, right, k - left_size);
          }
      }

  public:
      vector<int> topKFrequent(vector<int>& nums, int k) {
          // 步骤1：统计频率
          unordered_map<int, int> freq_map;
          for (int num : nums) {
              freq_map[num]++;
          }

          // 步骤2：提取<元素, 频率>对到数组
          vector<pair<int, int>> elements;
          for (auto& pair : freq_map) {
              elements.push_back(pair);
          }

          // 步骤3：快速选择前k个高频元素
          quickSelect(elements, 0, elements.size() - 1, k);

          // 步骤4：提取前k个元素的数值
          vector<int> result;
          for (int i = 0; i < k; ++i) {
              result.push_back(elements[i].first);
          }

          return result;
      }
  };
  ```

- 上述时间复杂度为 $O(n)$，最坏时间为 $O(n^2)$，空间复杂度为 $O(n)$

- 参考题目
  - [347. 前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)
  - [215. 数组中的第K个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/description/)
  - [692. 前K个高频单词](https://leetcode.cn/problems/top-k-frequent-words/)
  - [973. 最接近原点的 K 个点](https://leetcode.cn/problems/k-closest-points-to-origin/)
  - [659. 分割数组为连续子序列](https://leetcode.cn/problems/split-array-into-consecutive-subsequences/description/)
  - [451. 根据字符出现频率排序](https://leetcode.cn/problems/sort-characters-by-frequency/description/)
  - [169. 多数元素](https://leetcode.cn/problems/majority-element/description/)
  - [229. 多数元素 II](https://leetcode.cn/problems/majority-element-ii/description/)

### 数据流中的中位数

- 题目：[295. 数据流的中位数 - 力扣（LeetCode）](https://leetcode.cn/problems/find-median-from-data-stream/description/)

- 要计算的中位数，来自于左半部分的最大值和右半部分的最小值

- 随着 addNum 不断地添加数字，我们需要：
  - 保证 _left_ 的大小和 _right_ 的大小尽量相等；同时规定：在有奇数个数时，_left_ 比 _right_ 多 1 个数
  - 保证 _left_ 的所有元素都小于等于 _right_ 的所有元素

- 如果当前 _left_ 的大小和 _right_ 的大小相等
  - 如果添加的数字 _num_ 比较大，比如添加 7，那么把 7 加到 _right_ 中。现在 _left_ 比 _right_ 少 1 个数，不符合前文的规定，所以必须把 _right_ 的最小值从 _right_ 中去掉，添加到 _left_ 中。如此操作后，可以保证 _left_ 的所有元素都小于等于 _right_ 的所有元素
  - 如果添加的数字 _num_ 比较小，比如添加 0，那么把 0 加到 _left_ 中
  - 这两种情况可以合并：无论 _num_ 是大是小，都可以先把 _num_ 加到 _right_ 中，然后把 _right_ 的最小值从 _right_ 中去掉，并添加到 _left_ 中

- 如果当前 _left_ 比 _right_ 多 1 个数：
  - 如果添加的数字 _num_ 比较大，比如添加 7，那么把 7 加到 _right_ 中
  - 如果添加的数字 _num_ 比较小，比如添加 0，那么把 0 加到 _left_ 中。现在 _left_ 比 _right_ 多 2 个数，不符合前文的规定，所以必须把 _left_ 的最大值从 _left_ 中去掉，添加到 _right_ 中。如此操作后，可以保证 _left_ 的所有元素都小于等于 _right_ 的所有元素
  - 这两种情况可以合并：无论 _num_ 是大是小，都可以先把 _num_ 加到 _left_ 中，然后把 _left_ 的最大值从 _left_ 中去掉，并添加到 _right_ 中

- _left_ 是最大堆，_right_ 是最小堆
  - 如果当前有奇数个元素，中位数是 _left_ 的堆顶
  - 如果当前有偶数个元素，中位数是 _left_ 的堆顶和 _right_ 的堆顶的平均值

- 代码实现

  ```cpp
  class MedianFinder {
      priority_queue<int> left; // 最大堆
      priority_queue<int, vector<int>, greater<>> right; // 最小堆

  public:
      void addNum(int num) {
          if (left.size() == right.size()) {
              right.push(num);
              left.push(right.top());
              right.pop();
          } else {
              left.push(num);
              right.push(left.top());
              left.pop();
          }
      }

      double findMedian() {
          if (left.size() > right.size()) {
              return left.top();
          }
          return (left.top() + right.top()) / 2.0;
      }
  };
  ```

### 滑动窗口中位数

- 题目：[480. 滑动窗口中位数 - 力扣（LeetCode）](https://leetcode.cn/problems/sliding-window-median/description/)

- 显然，可以利用数据流中的中位数的思路来解决，但问题是，如何从堆中删除移动出窗口的元素？如果每次移动出窗口都进行删除操作，显然比较复杂

- 最小堆的特征总是保证堆顶是最小元素
  - 当你不需要关心堆顶时，不真正删除是没有关系的
  - 当你需要看堆顶时，如果堆顶不是懒删除的元素，正常使用即可，因为懒删除的元素一定比堆顶大，是否删除不影响堆顶
  - 如果堆顶是懒删除的元素，那么此时再删除这些元素即可，而且更高效，一直删到堆顶不是懒删除的正常元素为止，正常使用即可

- 可以使用懒删除堆
  - 用一个哈希表 _removeCnt_ 记录每个元素剩余需要删除的次数
  - 删除 remove(_x_)：把 _removeCnt_[*x*] 加一
  - 出堆 pop()：如果 _removeCnt_[堆顶]>0，则弹出堆顶，重复，直到 _removeCnt_[堆顶]=0；最后弹出堆顶元素
  - 入堆的逻辑不变

- 由于删除元素时只修改了 _removeCnt_，并没有操作堆，所以堆的大小并不是其真实大小。但我们需要根据堆的大小来平衡两个堆，从而计算中位数。怎么办？额外用一个变量 _size_ 表示堆的大小：
  - 删除和出堆：把 _size_ 减一
  - 入堆：把 _size_ 加一

- 代码实现

  ```cpp
  template<typename T, typename Compare = less<T>>
  class LazyHeap {
      priority_queue<T, vector<T>, Compare> pq;
      unordered_map<T, int> remove_cnt; // 每个元素剩余需要删除的次数
      size_t sz = 0; // 实际大小

      // 正式执行删除操作
      void apply_remove() {
          while (!pq.empty() && remove_cnt[pq.top()] > 0) {
              remove_cnt[pq.top()]--;
              pq.pop();
          }
      }

  public:
      size_t size() {
          return sz;
      }

      // 删除
      void remove(T x) {
          remove_cnt[x]++; // 懒删除
          sz--;
      }

      // 查看堆顶
      T top() {
          apply_remove();
          return pq.top();
      }

      // 出堆
      T pop() {
          apply_remove();
          sz--;
          T x = pq.top();
          pq.pop();
          return x;
      }

      // 入堆
      void push(T x) {
          pq.push(x);
          sz++;
      }

      // push(x) 然后 pop()
      T push_pop(T x) {
          if (sz > 0 && Compare()(x, top())) { // 可以替换堆顶
              pq.push(x);
              x = pq.top();
              pq.pop();
          }
          return x;
      }
  };

  class Solution {
  public:
      vector<double> medianSlidingWindow(vector<int>& nums, int k) {
          int n = nums.size();
          vector<double> ans(n - k + 1);
          LazyHeap<int> left; // 最大堆
          LazyHeap<int, greater<>> right; // 最小堆

          for (int i = 0; i < n; i++) {
              // 1. 进入窗口
              int in = nums[i];
              if (left.size() == right.size()) {
                  left.push(right.push_pop(in));
              } else {
                  right.push(left.push_pop(in));
              }

              int l = i + 1 - k;
              if (l < 0) { // 窗口大小不足 k
                  continue;
              }

              // 2. 计算答案
              if (k % 2) {
                  ans[l] = left.top();
              } else {
                  ans[l] = ((long long) left.top() + right.top()) / 2.0;
              }

              // 3. 离开窗口
              int out = nums[l];
              if (out <= left.top()) {
                  left.remove(out);
                  if (left.size() < right.size()) {
                      left.push(right.pop()); // 平衡两个堆的大小
                  }
              } else {
                  right.remove(out);
                  if (left.size() > right.size() + 1) {
                      right.push(left.pop()); // 平衡两个堆的大小
                  }
              }
          }

          return ans;
      }
  };
  ```

- 当然也可以使用有序集合

  ```cpp
  class Solution {
  public:
      vector<double> medianSlidingWindow(vector<int>& nums, int k) {
          vector<double> res;
          // multiset自动升序排列，支持重复元素
          multiset<int> window(nums.begin(), nums.begin() + k);
          // 初始化中位数迭代器：指向第k/2个元素（奇数时是中间，偶数时是右中）
          auto mid = next(window.begin(), k / 2);

          for (int i = k; ; ++i) {
              // 计算当前窗口的中位数
              if (k % 2 == 1) {
                  // 奇数长度：直接取中间元素
                  res.push_back(*mid);
              } else {
                  // 偶数长度：中间两个元素的平均值（注意类型转换避免溢出）
                  res.push_back((static_cast<double>(*mid) + *prev(mid)) / 2);
              }

              // 遍历结束条件
              if (i == nums.size()) break;

              // 步骤1：添加新元素（窗口右移，加入nums[i]）
              window.insert(nums[i]);
              // 如果新元素小于等于中位数，中位数左移（保持位置）
              if (nums[i] < *mid) {
                  --mid;
              }

              // 步骤2：删除移出的元素（窗口左边界nums[i-k]）
              int out_num = nums[i - k];
              // 如果移出的元素小于等于中位数，中位数右移（保持位置）
              if (out_num <= *mid) {
                  ++mid;
              }
              // 注意：multiset删除值时要用erase(iterator)，避免删除所有相同值
              window.erase(window.find(out_num));
          }

          return res;
      }
  };
  ```

### 滑动子数组的美丽值

- 题目：[2653. 滑动子数组的美丽值 - 力扣（LeetCode）](https://leetcode.cn/problems/sliding-subarray-beauty/)

- 显然也可以使用有序集合

  ```cpp
  class Solution {
  public:
      vector<int> getSubarrayBeauty(vector<int>& nums, int k, int x) {
          int n = nums.size();
          vector<int> res;
          multiset<int> window(nums.begin(), nums.begin() + k);
          for (int r = k;; r++) {
              auto mid = next(window.begin(), x - 1);
              if (*mid < 0) {
                  res.push_back(*mid);
              } else {
                  res.push_back(0);
              }
              if (r == n)
                  break;
              window.insert(nums[r]);
              int out_num = nums[r - k];
              window.erase(window.find(out_num));
          }
          return res;
      }
  };
  ```

- 但是以上代码会导致超时

- 题目中要给出数值范围是 [-50,50] 之间，因此只需要用计数数组统计窗口内负数的个数，从而直接定位第 x 小的负数
  - 计数数组：用 `cnt[101]` 统计窗口内每个数的出现次数（偏移 50，将 [-50,50] 映射到 [0,100]）
  - 窗口滑动：
    - 移出左边界元素：对应计数减 1；
    - 移入右边界元素：对应计数加 1；
  - 找第 x 小元素：遍历计数数组（从 - 50 到 50），累加计数，直到累加和 ≥x，此时的数就是第 x 小元素
  - 结果判断：若找到的数 <0 则加入结果，否则加 0

- 代码实现

  ```cpp
  class Solution {
  public:
      vector<int> getSubarrayBeauty(vector<int>& nums, int k, int x) {
          int n = nums.size();
          vector<int> res;
          const int OFFSET = 50; // 偏移量，将-50映射到0，0映射到50，50映射到100
          vector<int> cnt(101, 0); // cnt[i] 表示数 (i-OFFSET) 的出现次数

          // 初始化窗口
          for (int i = 0; i < k; ++i) {
              cnt[nums[i] + OFFSET]++;
          }

          // 找第x小元素的函数
          auto findXthSmallest = [&]() -> int {
              int sum = 0;
              // 从最小的数（-50）开始遍历
              for (int num = -50; num <= 50; ++num) {
                  sum += cnt[num + OFFSET];
                  if (sum >= x) {
                      return num;
                  }
              }
              return 0; // 理论上不会走到这里
          };

          // 滑动窗口
          for (int r = k;; ++r) {
              int xth = findXthSmallest();
              res.push_back(xth < 0 ? xth : 0);

              if (r == n) break;

              // 移出左边界元素
              int out_num = nums[r - k];
              cnt[out_num + OFFSET]--;
              // 移入右边界元素
              int in_num = nums[r];
              cnt[in_num + OFFSET]++;
          }

          return res;
      }
  };
  ```

- 可以进一步优化
  - 缩小计数数组范围：只统计负数（-50 ~ -1），正数无需记录（因为正数不影响「第 x 小的负数」判断），计数数组大小从 101→50；
  - 预判提前返回：维护一个变量 `neg_count` 记录窗口内负数的总个数：
    - 如果 `neg_count < x`：说明第 x 小的数一定是正数，直接返回 0，无需遍历计数数组；
    - 如果 `neg_count ≥ x`：再遍历负数的计数数组，找到第 x 小的负数

- 代码实现

  ```cpp
  class Solution {
  public:
      vector<int> getSubarrayBeauty(vector<int>& nums, int k, int x) {
          int n = nums.size();
          vector<int> res;
          const int MAX_NEG = 50; // 只统计-50~-1，共50个负数
          vector<int> neg_cnt(MAX_NEG, 0); // neg_cnt[i] 对应数字 -(i+1) 的出现次数（i=0→-1，i=49→-50）
          int neg_total = 0; // 窗口内负数的总个数

          // 初始化窗口
          for (int i = 0; i < k; ++i) {
              if (nums[i] < 0) {
                  int idx = -nums[i] - 1; // 映射：-1→0，-2→1，...，-50→49
                  neg_cnt[idx]++;
                  neg_total++;
              }
          }

          // 找第x小的负数（仅当neg_total >= x时调用）
          auto findXthNeg = [&]() -> int {
              int sum = 0;
              // 从最小的负数（-50）开始遍历（对应idx=49→0）
              for (int idx = MAX_NEG - 1; idx >= 0; --idx) {
                  sum += neg_cnt[idx];
                  if (sum >= x) {
                      return -(idx + 1); // 映射回原负数：idx=0→-1，idx=49→-50
                  }
              }
              return 0; // 理论上不会走到这里
          };

          // 滑动窗口
          for (int r = k;; ++r) {
              // 核心优化：先预判负数个数
              if (neg_total < x) {
                  res.push_back(0);
              } else {
                  res.push_back(findXthNeg());
              }

              if (r == n) break;

              // 移出左边界元素
              int out_num = nums[r - k];
              if (out_num < 0) {
                  int idx = -out_num - 1;
                  neg_cnt[idx]--;
                  neg_total--;
              }

              // 移入右边界元素
              int in_num = nums[r];
              if (in_num < 0) {
                  int idx = -in_num - 1;
                  neg_cnt[idx]++;
                  neg_total++;
              }
          }

          return res;
      }
  };
  ```

- 如果值域范围很大，那么就需要使用懒删除堆来解决

  ```cpp
  #include <vector>
  #include <queue>
  #include <unordered_map>
  #include <algorithm>
  using namespace std;

  class Solution {
  public:
      vector<int> getSubarrayBeauty(vector<int>& nums, int k, int x) {
          int n = nums.size();
          vector<int> res;

          // 左堆：大顶堆（存储前x小元素，用负数实现），堆顶是第x小元素
          priority_queue<int> left_heap;
          // 右堆：小顶堆（存储剩余元素）
          priority_queue<int, vector<int>, greater<int>> right_heap;
          // 懒删除哈希表：记录待删除元素的计数
          unordered_map<int, int> del_cnt;

          // 初始化窗口：先将前k个元素加入堆
          for (int i = 0; i < k; ++i) {
              add_num(nums[i], left_heap, right_heap, x);
          }

          // 懒删除核心函数：清理堆顶的待删除元素
          auto clean_heap = [&](priority_queue<int>& heap, bool is_left) {
              while (!heap.empty()) {
                  int top_val = heap.top();
                  // 左堆存储的是负数，需要还原
                  if (is_left) top_val = -top_val;
                  // 如果堆顶元素需要删除，则执行懒删除
                  if (del_cnt[top_val] > 0) {
                      del_cnt[top_val]--;
                      heap.pop();
                  } else {
                      break;
                  }
              }
          };

          // 滑动窗口
          for (int r = k;; ++r) {
              // 步骤1：清理两个堆的堆顶（懒删除）
              clean_heap(left_heap, true);
              clean_heap(right_heap, false);

              // 步骤2：获取第x小元素（左堆顶）
              int xth_smallest = 0;
              if (!left_heap.empty()) {
                  xth_smallest = -left_heap.top(); // 还原左堆的真实值
              }
              // 按规则加入结果：负数则取本身，否则取0
              res.push_back(xth_smallest < 0 ? xth_smallest : 0);

              // 遍历结束
              if (r == n) break;

              // 步骤3：移出窗口左边界元素（标记为待删除）
              int out_num = nums[r - k];
              del_cnt[out_num]++;

              // 步骤4：移入新元素，并重新平衡堆
              add_num(nums[r], left_heap, right_heap, x);

              // 步骤5：重新平衡两个堆的大小（确保左堆大小为x）
              rebalance(left_heap, right_heap, x, del_cnt);
          }

          return res;
      }

  private:
      // 将元素加入堆，并初步平衡
      void add_num(int num, priority_queue<int>& left_heap, priority_queue<int>& right_heap, int x) {
          // 先加入左堆（大顶堆，存储负数）
          left_heap.push(-num);
          // 如果左堆大小超过x，将堆顶移到右堆
          if (left_heap.size() > x) {
              int top_val = -left_heap.top();
              left_heap.pop();
              right_heap.push(top_val);
          }
      }

      // 重新平衡两个堆的大小（处理懒删除后的大小偏差）
      void rebalance(priority_queue<int>& left_heap, priority_queue<int>& right_heap, int x, unordered_map<int, int>& del_cnt) {
          // 临时清理堆顶，确保获取真实大小
          while (!left_heap.empty()) {
              int top_val = -left_heap.top();
              if (del_cnt[top_val] > 0) {
                  del_cnt[top_val]--;
                  left_heap.pop();
              } else {
                  break;
              }
          }
          while (!right_heap.empty()) {
              int top_val = right_heap.top();
              if (del_cnt[top_val] > 0) {
                  del_cnt[top_val]--;
                  right_heap.pop();
              } else {
                  break;
              }
          }

          // 左堆大小不足x：从右堆补充
          while (left_heap.size() < x && !right_heap.empty()) {
              int top_val = right_heap.top();
              right_heap.pop();
              left_heap.push(-top_val);
          }

          // 左堆大小超过x：移到右堆
          while (left_heap.size() > x) {
              int top_val = -left_heap.top();
              left_heap.pop();
              right_heap.push(top_val);
          }
      }
  };
  ```

### 序列顺序查询

- 题目：[2102. 序列顺序查询 - 力扣（LeetCode）](https://leetcode.cn/problems/sequentially-ordinal-rank-tracker/description/)

- 本质上就是求数据流中的第 K 大元素，但是这里动态求第 i 大元素
  - 数据流第 K 大元素：始终查询固定 K 的第 K 大元素（比如固定查第 3 大），查询目标固定，仅需维护 “前 K 大” 的元素
  - SORTracker：动态查询第 1、2、3... 优元素（查完第 1 优查第 2 优），查询目标递增，需要动态调整 “前 N 优”

- 显然，需要维护两个堆，其中右堆是小顶堆，其堆顶即为第 i 好的景点，可以实现一个 Place 结构体并重载运算符来简化比较逻辑

- 代码实现

  ```cpp
  struct Place {
      string name;
      int score;

      Place(string n, int s) : name(n), score(s) {}

      auto operator<=>(const Place& other) const {
          if (score != other.score) {
              return score <=> other.score;
          }
          return other.name <=> name;
      }

      bool operator==(const Place& other) const = default;
  };
  class SORTracker {
  public:
      priority_queue<Place, vector<Place>> left_heap;
      priority_queue<Place, vector<Place>, greater<Place>> right_heap;
      int cur = 1;
      SORTracker() {}

      void add(string name, int score) {
          Place place(name, score);
          right_heap.push(place);
          if (right_heap.size() > cur) {
              left_heap.push(right_heap.top());
              right_heap.pop();
          }
      }

      string get() {
          string result = right_heap.top().name;
          cur++;
          if (!left_heap.empty()) {
              right_heap.push(left_heap.top());
              left_heap.pop();
          }
          return result;
      }
  };

  /**
   * Your SORTracker object will be instantiated and called as such:
   * SORTracker* obj = new SORTracker();
   * obj->add(name,score);
   * string param_2 = obj->get();
   */
  ```

- 更简洁的代码实现

  ```cpp
  class SORTracker {
  public:
      // 左堆：大顶堆，存储「当前第cur_rank优」的元素（堆顶就是答案）
      // 排序规则：分数高优先，分数相同则字典序小优先
      priority_queue<pair<int, string>> left;
      // 右堆：小顶堆，存储「候选元素」（补充左堆用）
      priority_queue<pair<int, string>, vector<pair<int, string>>, greater<>> right;
      int cur_rank = 1; // 当前要查询的是「第cur_rank优」的元素

      SORTracker() = default; // 简化默认构造函数

      void add(string name, int score) {
          // 核心：将元素先入右堆，再平衡到左堆（保证左堆大小=cur_rank）
          // pair排序规则：先比第一个元素（分数），再比第二个（字典序）
          // 为了让「分数高、字典序小」优先，存储 (-score, name) 反转排序逻辑
          right.emplace(-score, name);

          // 左堆未达当前排名，从右堆补充
          if (left.size() < cur_rank) {
              left.push(right.top());
              right.pop();
          } else {
              // 左堆已满，将左堆中「最优」的元素移到右堆（保持左堆大小=cur_rank）
              left.push(right.top());
              right.pop();
              right.push(left.top());
              left.pop();
          }
      }

      string get() {
          if (left.empty()) return ""; // 空堆防护

          // 获取当前第cur_rank优的元素（左堆顶）
          string res = left.top().second;
          cur_rank++; // 下次查询第cur_rank+1优

          // 从右堆补充元素到左堆，维持平衡
          if (!right.empty()) {
              left.push(right.top());
              right.pop();
          }

          return res;
      }
  };
  ```

## 平衡二叉搜索树（Balanced BST）

### AVL 树

- AVL 树是最早发明的严格自平衡二叉搜索树（1962 年由 Adelson-Velsky 和 Landis 提出），核心是通过旋转操作维持任意节点的平衡因子绝对值≤1，确保树高始终为 O(log n)，让查找、插入、删除的最坏时间复杂度稳定在 O(log n)，彻底解决普通 BST 退化为链表的问题

- AVL 树首先是一棵二叉搜索树（BST），满足 BST 的所有性质：
  - 左子树所有节点值 < 根节点值
  - 右子树所有节点值 > 根节点值
  - 左右子树也都是 BST

- 在此基础上，增加严格平衡约束：任意节点的左右子树高度差（平衡因子）的绝对值 ≤ 1

- 平衡因子（BF）
  - 平衡因子 = 左子树高度 - 右子树高度
  - 合法取值：仅 -1、0、1（平衡状态）
  - 失衡判定：`|BF| ≥ 2`（需旋转修复）
    - `BF > 1`：左子树过高（左重）
    - `BF < -1`：右子树过高（右重）

- 节点高度规则
  - 空节点（`null`）高度 = -1（便于计算）
  - 叶子节点高度 = 0
  - 非叶子节点高度 = `max(左子树高度, 右子树高度) + 1`

- AVL 树的树高 `h` 与节点数 `n` 满足 h ≤ 1.44 \* log₂(n+2) - 1.328`，严格控制在对数级别，保证操作效率

- 旋转是 AVL 树维持平衡的核心，通过调整节点父子关系，将失衡子树恢复平衡，共4 种类型（对应 4 种失衡场景）

- 单旋转（2 种）
  - LL 型失衡 → 右旋转（Right Rotation）
    - 场景：在左子树的左孩子插入节点，导致根节点`BF=2`（左左重）
    - 操作：以失衡节点的左孩子为新根，原根降为新根的右孩子，新根的原右子树挂到原根的左孩子

    ```text
          30(BF=2)        20
         /                /  \
        20(BF=1)   →    10    30
       /
      10
    ```

  - RR 型失衡 → 左旋转（Left Rotation）
    - 场景：在右子树的右孩子插入节点，导致根节点`BF=-2`（右右重）
    - 操作：以失衡节点的右孩子为新根，原根降为新根的左孩子，新根的原左子树挂到原根的右孩子

    ```text
      10(BF=-2)          20
        \                /  \
         20(BF=-1)  →  10    30
          \
           30
    ```

- 双旋转（2 种，先单旋再单旋）
  - LR 型失衡 → 先左旋转，再右旋转
    - 场景：在左子树的右孩子插入节点，导致根节点BF=2（左右重）
    - 先对失衡节点的左孩子做左旋转（转为 LL 型），然后对失衡节点做右旋转

    ```text
          30(BF=2)        30          20
         /                /           /  \
        10(BF=-1)  →    20     →    10    30
         \              /
          20           10
    ```

  - RL 型失衡 → 先右旋转，再左旋转
    - 场景：在右子树的左孩子插入节点，导致根节点BF=-2（右左重）
    - 先对失衡节点的右孩子做右旋转（转为 RR 型），然后对失衡节点做左旋转

    ```cpp
      10(BF=-2)        10            20
        \               \            /  \
         30(BF=1)  →     20     →   10    30
        /                 \
       20                  30
    ```

- 查找操作
  - 与普通 BST 完全一致，无需旋转
  - 时间复杂度：O(log n)（树高始终为对数级）

- 插入操作（核心：插入 + 回溯 + 旋转）
  1.  按 BST 规则插入新节点，更新路径上所有节点的高度
  2.  从插入点向上回溯，计算每个祖先的平衡因子
  3.  找到第一个失衡节点（`|BF|≥2`），判断失衡类型（LL/RR/LR/RL）
  4.  执行对应旋转，更新高度，结束（插入仅需 1-2 次旋转）
  5.  时间复杂度：O(log n)

- 删除操作（比插入复杂）
  1.  按 BST 规则删除节点（分叶子、单孩子、双孩子三种情况）
  2.  从删除点向上回溯到根，更新所有节点高度、计算平衡因子
  3.  每遇到失衡节点，立即旋转修复（可能多次旋转，最多 O (log n) 次）
  4.  时间复杂度：O(log n)（旋转为常数操作）

- 节点结构定义

  ```cpp
  // ===================== AVL树节点定义 =====================
  struct AVLNode {
      int val;        // 节点值
      int height;     // 节点高度（空节点高度为-1，叶子节点为0）
      AVLNode* left;  // 左子节点
      AVLNode* right; // 右子节点

      // 构造函数
      AVLNode(int value) : val(value), height(0), left(nullptr), right(nullptr) {}
  };
  ```

- 辅助函数

  ```cpp
  // ===================== 辅助函数 =====================
  // 1. 获取节点高度（处理空节点）
  int getHeight(AVLNode* node) {
      return node ? node->height : -1;
  }

  // 2. 计算节点平衡因子（左子树高度 - 右子树高度）
  int getBalanceFactor(AVLNode* node) {
      return node ? getHeight(node->left) - getHeight(node->right) : 0;
  }

  // 3. 更新节点高度（基于左右子树高度）
  void updateHeight(AVLNode* node) {
      if (node) {
          node->height = 1 + max(getHeight(node->left), getHeight(node->right));
      }
  }
  ```

- 旋转操作

  ```cpp
  // ===================== 旋转操作（核心） =====================
  // 1. 右旋转（修复LL型失衡）
  // y是失衡节点，x是y的左孩子，旋转后x成为新根
  AVLNode* rightRotate(AVLNode* y) {
      AVLNode* x = y->left;
      AVLNode* T2 = x->right;

      // 执行旋转
      x->right = y;
      y->left = T2;

      // 先更新下层节点高度，再更新上层
      updateHeight(y);
      updateHeight(x);

      return x; // 返回新根节点
  }

  // 2. 左旋转（修复RR型失衡）
  // x是失衡节点，y是x的右孩子，旋转后y成为新根
  AVLNode* leftRotate(AVLNode* x) {
      AVLNode* y = x->right;
      AVLNode* T2 = y->left;

      // 执行旋转
      y->left = x;
      x->right = T2;

      // 更新高度
      updateHeight(x);
      updateHeight(y);

      return y; // 返回新根节点
  }
  ```

- 插入操作

  ```cpp
  // ===================== 插入操作 =====================
  AVLNode* insert(AVLNode* root, int val) {
      // 步骤1：标准BST插入
      if (root == nullptr) {
          return new AVLNode(val); // 空树，创建新节点作为根
      }

      // 递归插入左/右子树
      if (val < root->val) {
          root->left = insert(root->left, val);
      } else if (val > root->val) {
          root->right = insert(root->right, val);
      } else {
          // 不允许插入重复值
          cout << "值 " << val << " 已存在，无需插入" << endl;
          return root;
      }

      // 步骤2：更新当前节点高度
      updateHeight(root);

      // 步骤3：计算平衡因子，判断是否失衡
      int balance = getBalanceFactor(root);

      // 步骤4：处理4种失衡情况
      // 情况1：LL型（左左重）→ 右旋转
      if (balance > 1 && val < root->left->val) {
          return rightRotate(root);
      }

      // 情况2：RR型（右右重）→ 左旋转
      if (balance < -1 && val > root->right->val) {
          return leftRotate(root);
      }

      // 情况3：LR型（左右重）→ 先左旋转左孩子，再右旋转根
      if (balance > 1 && val > root->left->val) {
          root->left = leftRotate(root->left);
          return rightRotate(root);
      }

      // 情况4：RL型（右左重）→ 先右旋转右孩子，再左旋转根
      if (balance < -1 && val < root->right->val) {
          root->right = rightRotate(root->right);
          return leftRotate(root);
      }

      // 未失衡，直接返回当前节点
      return root;
  }
  ```

- 删除操作

  ```cpp
  // ===================== 删除操作（比插入复杂） =====================
  // 辅助函数：找到BST中最小值节点（用于删除有两个子节点的节点）
  AVLNode* findMinNode(AVLNode* node) {
      AVLNode* current = node;
      // 最小值在最左子节点
      while (current && current->left != nullptr) {
          current = current->left;
      }
      return current;
  }

  AVLNode* deleteNode(AVLNode* root, int val) {
      // 步骤1：标准BST删除
      if (root == nullptr) {
          cout << "值 " << val << " 不存在，无需删除" << endl;
          return nullptr;
      }

      // 递归查找并删除目标节点
      if (val < root->val) {
          root->left = deleteNode(root->left, val);
      } else if (val > root->val) {
          root->right = deleteNode(root->right, val);
      } else {
          // 找到目标节点，处理删除逻辑
          // 情况1：叶子节点 或 只有一个子节点
          if (root->left == nullptr || root->right == nullptr) {
              AVLNode* temp = root->left ? root->left : root->right;

              // 叶子节点（无子女）
              if (temp == nullptr) {
                  temp = root;
                  root = nullptr;
              } else {
                  // 只有一个子节点，替换当前节点
                  *root = *temp;
              }
              delete temp; // 释放原节点内存
          } else {
              // 情况2：有两个子节点 → 找右子树最小值节点替换当前节点
              AVLNode* temp = findMinNode(root->right);
              root->val = temp->val;          // 替换值
              root->right = deleteNode(root->right, temp->val); // 删除替换的节点
          }
      }

      // 如果删除后树为空，直接返回
      if (root == nullptr) {
          return nullptr;
      }

      // 步骤2：更新当前节点高度
      updateHeight(root);

      // 步骤3：计算平衡因子，判断是否失衡
      int balance = getBalanceFactor(root);

      // 步骤4：处理4种失衡情况（删除可能需要多次旋转）
      // 情况1：LL型
      if (balance > 1 && getBalanceFactor(root->left) >= 0) {
          return rightRotate(root);
      }

      // 情况2：LR型
      if (balance > 1 && getBalanceFactor(root->left) < 0) {
          root->left = leftRotate(root->left);
          return rightRotate(root);
      }

      // 情况3：RR型
      if (balance < -1 && getBalanceFactor(root->right) <= 0) {
          return leftRotate(root);
      }

      // 情况4：RL型
      if (balance < -1 && getBalanceFactor(root->right) > 0) {
          root->right = rightRotate(root->right);
          return leftRotate(root);
      }

      // 未失衡，返回当前节点
      return root;
  }
  ```

- 查找与遍历操作

  ```cpp
  // ===================== 查找操作 =====================
  bool search(AVLNode* root, int val) {
      if (root == nullptr) {
          return false; // 未找到
      }
      if (val == root->val) {
          return true;  // 找到
      } else if (val < root->val) {
          return search(root->left, val); // 递归查左子树
      } else {
          return search(root->right, val); // 递归查右子树
      }
  }

  // ===================== 遍历操作 =====================
  // 1. 前序遍历（根 → 左 → 右）
  void preOrder(AVLNode* root) {
      if (root) {
          cout << root->val << "(" << getBalanceFactor(root) << ") ";
          preOrder(root->left);
          preOrder(root->right);
      }
  }

  // 2. 中序遍历（左 → 根 → 右）→ BST中序遍历是升序
  void inOrder(AVLNode* root) {
      if (root) {
          inOrder(root->left);
          cout << root->val << "(" << getBalanceFactor(root) << ") ";
          inOrder(root->right);
      }
  }

  // 3. 后序遍历（左 → 右 → 根）
  void postOrder(AVLNode* root) {
      if (root) {
          postOrder(root->left);
          postOrder(root->right);
          cout << root->val << "(" << getBalanceFactor(root) << ") ";
      }
  }
  ```

- 辅助功能

  ```cpp
  // ===================== 辅助功能 =====================
  // 销毁整棵树（释放内存）
  void destroyTree(AVLNode*& root) {
      if (root) {
          destroyTree(root->left);
          destroyTree(root->right);
          delete root;
          root = nullptr;
      }
  }

  // 格式化打印树结构（便于可视化）
  void printTree(AVLNode* root, int space = 0, int indent = 4) {
      if (root == nullptr) {
          return;
      }
      space += indent;
      // 先打印右子树
      printTree(root->right, space);
      // 打印当前节点
      cout << endl;
      for (int i = indent; i < space; i++) {
          cout << " ";
      }
      cout << root->val << " [BF:" << getBalanceFactor(root) << "]" << endl;
      // 再打印左子树
      printTree(root->left, space);
  }

  // ===================== 测试用例 =====================
  int main() {
      AVLNode* root = nullptr;

      // 测试1：插入节点
      cout << "===== 插入节点：10, 20, 30, 40, 50, 25 =====" << endl;
      int insertVals[] = {10, 20, 30, 40, 50, 25};
      for (int val : insertVals) {
          root = insert(root, val);
      }

      // 打印树结构和遍历结果
      cout << "\n树结构（右侧为根，从上到下是右→根→左）：" << endl;
      printTree(root);

      cout << "\n前序遍历（值(BF)）：";
      preOrder(root);
      cout << "\n中序遍历（值(BF)）：";
      inOrder(root);
      cout << endl;

      // 测试2：查找节点
      cout << "\n===== 查找节点 =====" << endl;
      int searchVal = 30;
      cout << "查找 " << searchVal << "：" << (search(root, searchVal) ? "存在" : "不存在") << endl;
      searchVal = 15;
      cout << "查找 " << searchVal << "：" << (search(root, searchVal) ? "存在" : "不存在") << endl;

      // 测试3：删除节点
      cout << "\n===== 删除节点 30 =====" << endl;
      root = deleteNode(root, 30);
      cout << "删除后树结构：" << endl;
      printTree(root);
      cout << "\n删除后中序遍历：";
      inOrder(root);
      cout << endl;

      cout << "\n===== 删除节点 20 =====" << endl;
      root = deleteNode(root, 20);
      cout << "删除后树结构：" << endl;
      printTree(root);
      cout << "\n删除后中序遍历：";
      inOrder(root);
      cout << endl;

      // 测试4：删除不存在的节点
      cout << "\n===== 删除不存在的节点 100 =====" << endl;
      root = deleteNode(root, 100);

      // 释放内存
      destroyTree(root);
      cout << "\n树已销毁，内存释放完成" << endl;

      return 0;
  }
  ```

- 模板类 AVLTree

  ```cpp
  #include <iostream>
  #include <algorithm>
  #include <iomanip>
  #include <string>

  template <typename T>
  class AVLTree {
  private:
      // AVL树节点结构（私有，对外隐藏）
      struct Node {
          T val;
          int height;
          Node* left;
          Node* right;

          Node(const T& value) : val(value), height(0), left(nullptr), right(nullptr) {}
      };

      Node* root; // 根节点

      // ===================== 私有辅助函数（内部实现） =====================
      // 获取节点高度
      int getHeight(Node* node) const {
          return node ? node->height : -1;
      }

      // 计算平衡因子
      int getBalanceFactor(Node* node) const {
          return node ? getHeight(node->left) - getHeight(node->right) : 0;
      }

      // 更新节点高度
      void updateHeight(Node* node) {
          if (node) {
              node->height = 1 + std::max(getHeight(node->left), getHeight(node->right));
          }
      }

      // 右旋转
      Node* rightRotate(Node* y) {
          Node* x = y->left;
          Node* T2 = x->right;

          // 执行旋转
          x->right = y;
          y->left = T2;

          // 更新高度
          updateHeight(y);
          updateHeight(x);

          return x;
      }

      // 左旋转
      Node* leftRotate(Node* x) {
          Node* y = x->right;
          Node* T2 = y->left;

          // 执行旋转
          y->left = x;
          x->right = T2;

          // 更新高度
          updateHeight(x);
          updateHeight(y);

          return y;
      }

      // 递归插入（内部实现）
      Node* insert(Node* node, const T& val) {
          // 标准BST插入
          if (node == nullptr) {
              return new Node(val);
          }

          if (val < node->val) {
              node->left = insert(node->left, val);
          } else if (val > node->val) {
              node->right = insert(node->right, val);
          } else {
              // 重复值不插入
              std::cout << "值 " << val << " 已存在，无需插入" << std::endl;
              return node;
          }

          // 更新高度
          updateHeight(node);

          // 计算平衡因子
          int balance = getBalanceFactor(node);

          // 处理4种失衡情况
          // LL型
          if (balance > 1 && val < node->left->val) {
              return rightRotate(node);
          }
          // RR型
          if (balance < -1 && val > node->right->val) {
              return leftRotate(node);
          }
          // LR型
          if (balance > 1 && val > node->left->val) {
              node->left = leftRotate(node->left);
              return rightRotate(node);
          }
          // RL型
          if (balance < -1 && val < node->right->val) {
              node->right = rightRotate(node->right);
              return leftRotate(node);
          }

          return node;
      }

      // 查找最小值节点（内部使用）
      Node* findMinNode(Node* node) const {
          Node* current = node;
          while (current && current->left != nullptr) {
              current = current->left;
          }
          return current;
      }

      // 递归删除（内部实现）
      Node* deleteNode(Node* node, const T& val) {
          // 标准BST删除
          if (node == nullptr) {
              std::cout << "值 " << val << " 不存在，无需删除" << std::endl;
              return nullptr;
          }

          if (val < node->val) {
              node->left = deleteNode(node->left, val);
          } else if (val > node->val) {
              node->right = deleteNode(node->right, val);
          } else {
              // 找到目标节点，处理删除逻辑
              if (node->left == nullptr || node->right == nullptr) {
                  Node* temp = node->left ? node->left : node->right;

                  if (temp == nullptr) {
                      temp = node;
                      node = nullptr;
                  } else {
                      *node = *temp;
                  }
                  delete temp;
              } else {
                  // 有两个子节点，找右子树最小值
                  Node* temp = findMinNode(node->right);
                  node->val = temp->val;
                  node->right = deleteNode(node->right, temp->val);
              }
          }

          if (node == nullptr) {
              return nullptr;
          }

          // 更新高度
          updateHeight(node);

          // 计算平衡因子
          int balance = getBalanceFactor(node);

          // 处理失衡
          // LL型
          if (balance > 1 && getBalanceFactor(node->left) >= 0) {
              return rightRotate(node);
          }
          // LR型
          if (balance > 1 && getBalanceFactor(node->left) < 0) {
              node->left = leftRotate(node->left);
              return rightRotate(node);
          }
          // RR型
          if (balance < -1 && getBalanceFactor(node->right) <= 0) {
              return leftRotate(node);
          }
          // RL型
          if (balance < -1 && getBalanceFactor(node->right) > 0) {
              node->right = rightRotate(node->right);
              return leftRotate(node);
          }

          return node;
      }

      // 递归查找（内部实现）
      bool search(Node* node, const T& val) const {
          if (node == nullptr) {
              return false;
          }
          if (val == node->val) {
              return true;
          } else if (val < node->val) {
              return search(node->left, val);
          } else {
              return search(node->right, val);
          }
      }

      // 递归前序遍历（内部实现）
      void preOrder(Node* node) const {
          if (node) {
              std::cout << node->val << "(BF:" << getBalanceFactor(node) << ") ";
              preOrder(node->left);
              preOrder(node->right);
          }
      }

      // 递归中序遍历（内部实现）
      void inOrder(Node* node) const {
          if (node) {
              inOrder(node->left);
              std::cout << node->val << "(BF:" << getBalanceFactor(node) << ") ";
              inOrder(node->right);
          }
      }

      // 递归后序遍历（内部实现）
      void postOrder(Node* node) const {
          if (node) {
              postOrder(node->left);
              postOrder(node->right);
              std::cout << node->val << "(BF:" << getBalanceFactor(node) << ") ";
          }
      }

      // 递归销毁树（内部实现）
      void destroyTree(Node*& node) {
          if (node) {
              destroyTree(node->left);
              destroyTree(node->right);
              delete node;
              node = nullptr;
          }
      }

      // 递归打印树结构（内部实现）
      void printTree(Node* node, int space, int indent) const {
          if (node == nullptr) {
              return;
          }
          space += indent;
          printTree(node->right, space, indent);
          std::cout << std::endl;
          for (int i = indent; i < space; i++) {
              std::cout << " ";
          }
          std::cout << node->val << " [BF:" << getBalanceFactor(node) << "]" << std::endl;
          printTree(node->left, space, indent);
      }

  public:
      // ===================== 公共接口（对外暴露） =====================
      // 构造函数
      AVLTree() : root(nullptr) {}

      // 析构函数（自动释放内存）
      ~AVLTree() {
          destroyTree(root);
      }

      // 禁止拷贝构造和赋值（避免浅拷贝导致重复释放）
      AVLTree(const AVLTree&) = delete;
      AVLTree& operator=(const AVLTree&) = delete;

      // 插入元素
      void insert(const T& val) {
          root = insert(root, val);
      }

      // 删除元素
      void remove(const T& val) {
          root = deleteNode(root, val);
      }

      // 查找元素
      bool contains(const T& val) const {
          return search(root, val);
      }

      // 前序遍历
      void preOrderTraversal() const {
          if (root == nullptr) {
              std::cout << "树为空" << std::endl;
              return;
          }
          preOrder(root);
          std::cout << std::endl;
      }

      // 中序遍历（升序）
      void inOrderTraversal() const {
          if (root == nullptr) {
              std::cout << "树为空" << std::endl;
              return;
          }
          inOrder(root);
          std::cout << std::endl;
      }

      // 后序遍历
      void postOrderTraversal() const {
          if (root == nullptr) {
              std::cout << "树为空" << std::endl;
              return;
          }
          postOrder(root);
          std::cout << std::endl;
      }

      // 打印树结构
      void print(int indent = 4) const {
          if (root == nullptr) {
              std::cout << "树为空" << std::endl;
              return;
          }
          printTree(root, 0, indent);
      }

      // 判断树是否为空
      bool isEmpty() const {
          return root == nullptr;
      }
  };

  // ===================== 测试用例 =====================
  int main() {
      // 测试1：int类型的AVL树
      std::cout << "===== 测试int类型AVL树 =====" << std::endl;
      AVLTree<int> intTree;
      int intVals[] = {10, 20, 30, 40, 50, 25};
      for (int val : intVals) {
          intTree.insert(val);
      }

      std::cout << "树结构：" << std::endl;
      intTree.print();

      std::cout << "\n前序遍历：";
      intTree.preOrderTraversal();
      std::cout << "中序遍历（升序）：";
      intTree.inOrderTraversal();

      std::cout << "\n查找 30：" << (intTree.contains(30) ? "存在" : "不存在") << std::endl;
      std::cout << "查找 15：" << (intTree.contains(15) ? "存在" : "不存在") << std::endl;

      std::cout << "\n删除 30 后树结构：" << std::endl;
      intTree.remove(30);
      intTree.print();
      std::cout << "删除后中序遍历：";
      intTree.inOrderTraversal();

      // 测试2：string类型的AVL树
      std::cout << "\n===== 测试string类型AVL树 =====" << std::endl;
      AVLTree<std::string> strTree;
      std::string strVals[] = {"apple", "banana", "cherry", "date", "elderberry", "blueberry"};
      for (const std::string& val : strVals) {
          strTree.insert(val);
      }

      std::cout << "字符串树中序遍历（字典序）：";
      strTree.inOrderTraversal();
      std::cout << "查找 'cherry'：" << (strTree.contains("cherry") ? "存在" : "不存在") << std::endl;
      std::cout << "删除 'banana' 后中序遍历：";
      strTree.remove("banana");
      strTree.inOrderTraversal();

      return 0;
  }
  ```

- 如果需要支持自定义类（如`Person`），只需为该类重载`<`和`>`运算符：

  ```cpp
  // 示例：自定义Person类
  struct Person {
      std::string name;
      int age;

      // 重载比较运算符（按年龄比较）
      bool operator<(const Person& other) const {
          return age < other.age;
      }

      bool operator>(const Person& other) const {
          return age > other.age;
      }

      // 重载输出运算符（便于打印）
      friend std::ostream& operator<<(std::ostream& os, const Person& p) {
          os << p.name << "(" << p.age << ")";
          return os;
      }
  };

  // 使用示例
  // AVLTree<Person> personTree;
  // personTree.insert({"Alice", 25});
  // personTree.insert({"Bob", 30});
  // personTree.inOrderTraversal();
  ```

### 红黑树

- 红黑树（Red-Black Tree）是一种近似平衡的二叉搜索树（BST），它放弃了 AVL 树「严格平衡（平衡因子≤1）」的约束，转而通过「颜色规则」维持「黑高平衡」，在保证查找效率接近 O (log n) 的同时，大幅降低插入 / 删除的旋转次数，是工业界应用最广泛的平衡树（如 Java TreeMap、C++ STL set/map、Linux 内核调度等）

- 红黑树的设计取舍：

  | 特性         | AVL 树                          | 红黑树                           |
  | :----------- | :------------------------------ | :------------------------------- |
  | 平衡标准     | 严格平衡：任意节点 BF∈{-1,0,1}  | 近似平衡：黑高相同（见下文定义） |
  | 树高上限     | h ≤ 1.44log₂(n+2) - 1.328       | h ≤ 2log₂(n+1)                   |
  | 查找效率     | 略高（树更矮）                  | 略低（树稍高）                   |
  | 插入旋转次数 | 最多 2 次（单旋 / 双旋）        | 最多 2 次                        |
  | 删除旋转次数 | 最多 O (log n) 次（需回溯到根） | 最多 3 次                        |
  | 实现复杂度   | 高（需维护高度 / 平衡因子）     | 中（需维护颜色 / 黑高）          |
  | 适用场景     | 查询密集、修改稀疏              | 修改频繁、查询适中（工业首选）   |

- 红黑树以「牺牲少量查找效率」为代价，换取「修改操作的低开销」，更适合实际工程中「增删改查混合」的场景；而 AVL 树仅适合「几乎只查不改」的场景

- 红黑树首先是一棵 BST，在此基础上增加5 条颜色规则，通过这些规则保证「从根到任意叶子的路径上，黑节点数量相同（黑高平衡）」：
  - 每个节点必须是红色或黑色（用布尔值 / 枚举表示即可）
  - 5 条核心性质（必须全部满足）
    - 根节点必须是黑色；
    - 所有叶子节点（NIL 节点）是黑色（红黑树的叶子不是普通 BST 的叶子，而是「空节点」，记为 NIL，统一处理边界）；
    - 红色节点的子节点必须是黑色（禁止「红 - 红相连」，避免连续红节点导致路径过长）；
    - 从任意节点到其所有后代 NIL 叶子的路径上，黑节点数量相同（核心：黑高平衡）；
    - 新插入的节点默认是红色（减少破坏规则的概率：插入红色节点仅可能违反规则 3，插入黑色节点必违反规则 4）
  - 黑高（Black Height）
    - 定义：从某节点到其后代 NIL 叶子的路径上，黑色节点的数量（不包含当前节点）；
    - 示例：若节点 A 到 NIL 的路径是「红→黑→NIL」，则 A 的黑高 = 1；若路径是「黑→红→黑→NIL」，则黑高 = 2
    - 红黑树的平衡本质：任意节点的左右子树黑高相同，而非整体高度差≤1

- 红黑树的插入流程分为两步：1. 按 BST 插入并标记为红；2. 修复颜色 / 旋转，恢复 5 条规则
  - 插入前的关键概念
    - 父节点（P）：新节点的父节点；
    - 祖父节点（G）：P 的父节点；
    - 叔节点（U）：P 的兄弟节点（G 的另一个子节点）；
    - 插入后仅可能违反规则 3（红 - 红相连），需分 3 种情况修复

  - 叔节点 U 是红色 → 仅改颜色，无需旋转
    - 条件：P 红 + U 红 + G 黑

    - 操作：
      1.  P 改为黑；
      2.  U 改为黑；
      3.  G 改为红；
      4.  把 G 当作新 Z，向上回溯检查（可能触发上层红 - 红相连）

    - 示例

      ```text
            G(黑)          G(红)
           /  \           /  \
          P(红) U(红) →  P(黑) U(黑)
         /              /
        Z(红)          Z(红)
      ```

    - 改颜色后，黑高不变（G 从黑变红，P/U 从红变黑，整体黑高仍平衡），仅需向上检查 G 是否违反规则

  - 叔节点 U 是黑色，且 Z 是「外侧节点」（LL/RR 型）→ 旋转 + 改颜色
    - 条件：P 红 + U 黑 + G 黑 + Z 是 P 的左孩子（LL 型）/ 右孩子（RR 型）

    - 操作（LL 型为例）：
      1.  对 G 做右旋转（同 AVL 的 LL 旋转）；
      2.  P 改为黑，G 改为红

    - 示例

      ```text
            G(黑)          P(黑)
           /              /  \
          P(红)   →      Z(红) G(红)
         /
        Z(红)
      ```

    - 旋转后消除红 - 红相连，改颜色恢复黑高平衡

  - 叔节点 U 是黑色，且 Z 是「内侧节点」（LR/RL 型）→ 先旋 P，再旋 G + 改颜色
    - 条件：P 红 + U 黑 + G 黑 + Z 是 P 的右孩子（LR 型）/ 左孩子（RL 型）

    - 操作（LR 型为例）：
      1.  对 P 做左旋转（转为 LL 型，同 AVL 的 LR 第一步）；
      2.  交换 Z 和 P 的角色（此时 Z 成为新的 P）；
      3.  执行场景 2 的操作（对 G 右旋转 + 改颜色）

    - 示例

      ```text
            G(黑)          G(黑)          Z(黑)
           /              /              /  \
          P(红)   →      Z(红)   →      P(红) G(红)
           \            /
            Z(红)      P(红)
      ```

    - 先把 LR/RL 型转为 LL/RR 型，再用场景 2 的方法修复

  - 插入修复的最终兜底
    - 如果回溯到根节点且根节点被改为红色，需将根节点改回黑色（满足规则 1），此时整棵树的黑高 + 1，不违反其他规则

- 删除是红黑树最复杂的操作，核心逻辑是：
  1.  按 BST 删除节点（分叶子 / 单孩子 / 双孩子）；
  2.  若删除的是黑色节点，会破坏「黑高平衡（规则 4）」，需修复；
  3.  修复的核心是「补充黑节点」或「旋转调整颜色」，最终恢复 5 条规则

- 删除操作的核心结论
  - 删除红色节点：不影响黑高，无需修复
  - 删除黑色节点：需通过「兄弟节点借黑」「旋转」「改颜色」等方式补充黑高，最多触发 3 次旋转

- 代码实现

  ```cpp
  #include <iostream>
  #include <algorithm>
  #include <iomanip>
  #include <string>

  // 颜色枚举类型
  enum class Color { RED, BLACK };

  // 红黑树节点模板结构（私有内部使用）
  template <typename T>
  struct RBNode {
      T val;                // 节点值
      Color color;          // 节点颜色
      RBNode* left;         // 左子节点
      RBNode* right;        // 右子节点
      RBNode* parent;       // 父节点（红黑树必须维护）
      RBNode* nil;          // 指向全局NIL节点（统一空节点处理）

      // 构造函数
      RBNode(const T& value, RBNode* nilNode)
          : val(value), color(Color::RED),  // 新节点默认红色
            left(nilNode), right(nilNode), parent(nilNode), nil(nilNode) {}
  };

  // 红黑树模板类
  template <typename T>
  class RBTree {
  private:
      RBNode<T>* root;      // 根节点
      RBNode<T>* nil;       // 全局NIL节点（所有空指针指向它，颜色为黑）

      // ===================== 私有辅助函数 =====================
      // 左旋转（核心操作，维护父节点关系）
      void leftRotate(RBNode<T>* x) {
          RBNode<T>* y = x->right;  // y是x的右孩子

          // 步骤1：将y的左子树设为x的右子树
          x->right = y->left;
          if (y->left != nil) {
              y->left->parent = x;
          }

          // 步骤2：将y的父节点设为x的父节点
          y->parent = x->parent;
          if (x->parent == nil) {    // x是根节点
              root = y;
          } else if (x == x->parent->left) {  // x是左孩子
              x->parent->left = y;
          } else {                            // x是右孩子
              x->parent->right = y;
          }

          // 步骤3：将x设为y的左孩子
          y->left = x;
          x->parent = y;
      }

      // 右旋转（与左旋转对称）
      void rightRotate(RBNode<T>* y) {
          RBNode<T>* x = y->left;   // x是y的左孩子

          // 步骤1：将x的右子树设为y的左子树
          y->left = x->right;
          if (x->right != nil) {
              x->right->parent = y;
          }

          // 步骤2：将x的父节点设为y的父节点
          x->parent = y->parent;
          if (y->parent == nil) {    // y是根节点
              root = x;
          } else if (y == y->parent->left) {  // y是左孩子
              y->parent->left = x;
          } else {                            // y是右孩子
              y->parent->right = x;
          }

          // 步骤3：将y设为x的右孩子
          x->right = y;
          y->parent = x;
      }

      // 插入后修复红黑树性质
      void insertFixup(RBNode<T>* z) {
          // 循环修复：当父节点是红色（违反"红父不能有红子"规则）
          while (z->parent->color == Color::RED) {
              if (z->parent == z->parent->parent->left) {  // 父节点是祖父的左孩子
                  RBNode<T>* u = z->parent->parent->right; // 叔节点（祖父的右孩子）

                  // 场景1：叔节点是红色 → 仅改颜色，向上回溯
                  if (u->color == Color::RED) {
                      z->parent->color = Color::BLACK;      // 父节点改黑
                      u->color = Color::BLACK;              // 叔节点改黑
                      z->parent->parent->color = Color::RED;// 祖父节点改红
                      z = z->parent->parent;                // 祖父作为新节点继续检查
                  } else {
                      // 场景3：z是父节点的右孩子（LR型）→ 先左旋父节点转为LL型
                      if (z == z->parent->right) {
                          z = z->parent;
                          leftRotate(z);
                      }
                      // 场景2：z是父节点的左孩子（LL型）→ 右旋祖父+改颜色
                      z->parent->color = Color::BLACK;
                      z->parent->parent->color = Color::RED;
                      rightRotate(z->parent->parent);
                  }
              } else {  // 父节点是祖父的右孩子（对称逻辑）
                  RBNode<T>* u = z->parent->parent->left; // 叔节点（祖父的左孩子）

                  // 场景1：叔节点是红色 → 改颜色
                  if (u->color == Color::RED) {
                      z->parent->color = Color::BLACK;
                      u->color = Color::BLACK;
                      z->parent->parent->color = Color::RED;
                      z = z->parent->parent;
                  } else {
                      // 场景3：z是父节点的左孩子（RL型）→ 先右旋父节点转为RR型
                      if (z == z->parent->left) {
                          z = z->parent;
                          rightRotate(z);
                      }
                      // 场景2：z是父节点的右孩子（RR型）→ 左旋祖父+改颜色
                      z->parent->color = Color::BLACK;
                      z->parent->parent->color = Color::RED;
                      leftRotate(z->parent->parent);
                  }
              }
          }
          root->color = Color::BLACK;  // 兜底：根节点必须是黑色
      }

      // 删除后修复红黑树性质（最复杂的部分）
      void deleteFixup(RBNode<T>* x) {
          while (x != root && x->color == Color::BLACK) {
              if (x == x->parent->left) {  // x是左孩子
                  RBNode<T>* w = x->parent->right; // 兄弟节点

                  // 情况1：兄弟节点是红色 → 改颜色+左旋父节点
                  if (w->color == Color::RED) {
                      w->color = Color::BLACK;
                      x->parent->color = Color::RED;
                      leftRotate(x->parent);
                      w = x->parent->right;
                  }

                  // 情况2：兄弟的两个孩子都是黑色 → 兄弟改红，x上移
                  if (w->left->color == Color::BLACK && w->right->color == Color::BLACK) {
                      w->color = Color::RED;
                      x = x->parent;
                  } else {
                      // 情况3：兄弟的右孩子是黑色，左孩子是红色 → 改颜色+右旋兄弟
                      if (w->right->color == Color::BLACK) {
                          w->left->color = Color::BLACK;
                          w->color = Color::RED;
                          rightRotate(w);
                          w = x->parent->right;
                      }
                      // 情况4：兄弟的右孩子是红色 → 改颜色+左旋父节点
                      w->color = x->parent->color;
                      x->parent->color = Color::BLACK;
                      w->right->color = Color::BLACK;
                      leftRotate(x->parent);
                      x = root; // 退出循环
                  }
              } else {  // x是右孩子（对称逻辑）
                  RBNode<T>* w = x->parent->left; // 兄弟节点

                  // 情况1：兄弟节点是红色
                  if (w->color == Color::RED) {
                      w->color = Color::BLACK;
                      x->parent->color = Color::RED;
                      rightRotate(x->parent);
                      w = x->parent->left;
                  }

                  // 情况2：兄弟的两个孩子都是黑色
                  if (w->right->color == Color::BLACK && w->left->color == Color::BLACK) {
                      w->color = Color::RED;
                      x = x->parent;
                  } else {
                      // 情况3：兄弟的左孩子是黑色，右孩子是红色
                      if (w->left->color == Color::BLACK) {
                          w->right->color = Color::BLACK;
                          w->color = Color::RED;
                          leftRotate(w);
                          w = x->parent->left;
                      }
                      // 情况4：兄弟的左孩子是红色
                      w->color = x->parent->color;
                      x->parent->color = Color::BLACK;
                      w->left->color = Color::BLACK;
                      rightRotate(x->parent);
                      x = root; // 退出循环
                  }
              }
          }
          x->color = Color::BLACK; // 最后将x设为黑色
      }

      // 查找最小值节点（删除用）
      RBNode<T>* findMinNode(RBNode<T>* node) const {
          while (node->left != nil) {
              node = node->left;
          }
          return node;
      }

      // 内部插入实现
      void insertNode(const T& val) {
          // 1. 按BST规则查找插入位置
          RBNode<T>* y = nil;       // 父节点暂存
          RBNode<T>* x = root;      // 遍历指针
          while (x != nil) {
              y = x;
              if (val < x->val) {
                  x = x->left;
              } else if (val > x->val) {
                  x = x->right;
              } else {
                  std::cout << "值 " << val << " 已存在，无需插入" << std::endl;
                  return; // 重复值不插入
              }
          }

          // 2. 创建新节点
          RBNode<T>* z = new RBNode<T>(val, nil);
          z->parent = y;

          // 3. 挂载新节点
          if (y == nil) {          // 空树，新节点为根
              root = z;
          } else if (val < y->val) { // 挂到左孩子
              y->left = z;
          } else {                  // 挂到右孩子
              y->right = z;
          }

          // 4. 修复红黑树性质
          insertFixup(z);
      }

      // 内部删除实现
      void deleteNode(RBNode<T>* z) {
          RBNode<T>* y = z;        // 要删除的节点
          RBNode<T>* x = nil;      // 替换y的节点
          Color originalColor = y->color; // 记录原始颜色

          // 情况1：z只有右孩子（或无孩子）
          if (z->left == nil) {
              x = z->right;
              transplant(z, z->right); // 移植节点
          }
          // 情况2：z只有左孩子
          else if (z->right == nil) {
              x = z->left;
              transplant(z, z->left);
          }
          // 情况3：z有两个孩子 → 找右子树最小值替换
          else {
              y = findMinNode(z->right);
              originalColor = y->color;
              x = y->right;

              if (y->parent == z) {
                  x->parent = y;
              } else {
                  transplant(y, y->right);
                  y->right = z->right;
                  y->right->parent = y;
              }

              transplant(z, y);
              y->left = z->left;
              y->left->parent = y;
              y->color = z->color;
          }

          // 如果删除的是黑色节点，需要修复性质
          if (originalColor == Color::BLACK) {
              deleteFixup(x);
          }

          // 释放被删除节点的内存
          delete z;
      }

      // 移植节点（将u替换为v，仅处理父节点关系）
      void transplant(RBNode<T>* u, RBNode<T>* v) {
          if (u->parent == nil) {
              root = v;
          } else if (u == u->parent->left) {
              u->parent->left = v;
          } else {
              u->parent->right = v;
          }
          v->parent = u->parent;
      }

      // 内部查找实现
      RBNode<T>* searchNode(const T& val) const {
          RBNode<T>* current = root;
          while (current != nil) {
              if (val == current->val) {
                  return current;
              } else if (val < current->val) {
                  current = current->left;
              } else {
                  current = current->right;
              }
          }
          return nil; // 未找到
      }

      // 递归中序遍历（升序）
      void inOrderTraversal(RBNode<T>* node) const {
          if (node != nil) {
              inOrderTraversal(node->left);
              std::cout << node->val << "(" << (node->color == Color::RED ? "R" : "B") << ") ";
              inOrderTraversal(node->right);
          }
      }

      // 递归前序遍历
      void preOrderTraversal(RBNode<T>* node) const {
          if (node != nil) {
              std::cout << node->val << "(" << (node->color == Color::RED ? "R" : "B") << ") ";
              preOrderTraversal(node->left);
              preOrderTraversal(node->right);
          }
      }

      // 递归销毁树
      void destroyTree(RBNode<T>* node) {
          if (node != nil) {
              destroyTree(node->left);
              destroyTree(node->right);
              delete node;
          }
      }

      // 递归打印树结构
      void printTree(RBNode<T>* node, int space, int indent) const {
          if (node == nil) {
              return;
          }
          space += indent;
          // 先打印右子树
          printTree(node->right, space, indent);

          std::cout << std::endl;
          for (int i = indent; i < space; i++) {
              std::cout << " ";
          }
          // 打印节点值+颜色
          std::cout << node->val << "(" << (node->color == Color::RED ? "R" : "B") << ")" << std::endl;

          // 打印左子树
          printTree(node->left, space, indent);
      }

  public:
      // ===================== 公共接口 =====================
      // 构造函数：初始化NIL节点
      RBTree() {
          nil = new RBNode<T>(T(), nullptr);
          nil->color = Color::BLACK;  // NIL节点必须是黑色
          nil->left = nil;
          nil->right = nil;
          nil->parent = nil;
          nil->nil = nil;
          root = nil; // 初始根指向NIL
      }

      // 析构函数：销毁整棵树
      ~RBTree() {
          destroyTree(root);
          delete nil; // 释放NIL节点
      }

      // 禁止拷贝构造和赋值（避免浅拷贝）
      RBTree(const RBTree&) = delete;
      RBTree& operator=(const RBTree&) = delete;

      // 插入元素
      void insert(const T& val) {
          insertNode(val);
      }

      // 删除元素
      void remove(const T& val) {
          RBNode<T>* z = searchNode(val);
          if (z == nil) {
              std::cout << "值 " << val << " 不存在，无需删除" << std::endl;
              return;
          }
          deleteNode(z);
      }

      // 查找元素
      bool contains(const T& val) const {
          return searchNode(val) != nil;
      }

      // 中序遍历（对外接口）
      void inOrder() const {
          if (root == nil) {
              std::cout << "树为空" << std::endl;
              return;
          }
          inOrderTraversal(root);
          std::cout << std::endl;
      }

      // 前序遍历（对外接口）
      void preOrder() const {
          if (root == nil) {
              std::cout << "树为空" << std::endl;
              return;
          }
          preOrderTraversal(root);
          std::cout << std::endl;
      }

      // 打印树结构（可视化）
      void print(int indent = 4) const {
          if (root == nil) {
              std::cout << "树为空" << std::endl;
              return;
          }
          printTree(root, 0, indent);
          std::cout << std::endl;
      }

      // 判断树是否为空
      bool isEmpty() const {
          return root == nil;
      }
  };

  // ===================== 测试用例 =====================
  int main() {
      // 测试1：int类型红黑树
      std::cout << "===== 测试int类型红黑树 =====" << std::endl;
      RBTree<int> intRBTree;

      // 插入节点
      int intVals[] = {10, 20, 30, 40, 50, 25};
      std::cout << "插入节点：10,20,30,40,50,25" << std::endl;
      for (int val : intVals) {
          intRBTree.insert(val);
      }

      // 打印树结构和遍历结果
      std::cout << "\n树结构（右侧为根，R=红，B=黑）：" << std::endl;
      intRBTree.print();

      std::cout << "前序遍历：";
      intRBTree.preOrder();
      std::cout << "中序遍历（升序）：";
      intRBTree.inOrder();

      // 查找测试
      std::cout << "\n查找 30：" << (intRBTree.contains(30) ? "存在" : "不存在") << std::endl;
      std::cout << "查找 15：" << (intRBTree.contains(15) ? "存在" : "不存在") << std::endl;

      // 删除测试
      std::cout << "\n删除节点 30 后：" << std::endl;
      intRBTree.remove(30);
      std::cout << "树结构：" << std::endl;
      intRBTree.print();
      std::cout << "中序遍历：";
      intRBTree.inOrder();

      std::cout << "\n删除节点 20 后：" << std::endl;
      intRBTree.remove(20);
      std::cout << "树结构：" << std::endl;
      intRBTree.print();
      std::cout << "中序遍历：";
      intRBTree.inOrder();

      // 测试2：string类型红黑树
      std::cout << "\n===== 测试string类型红黑树 =====" << std::endl;
      RBTree<std::string> strRBTree;
      std::string strVals[] = {"apple", "banana", "cherry", "date", "blueberry"};
      std::cout << "插入字符串：apple,banana,cherry,date,blueberry" << std::endl;
      for (const std::string& val : strVals) {
          strRBTree.insert(val);
      }

      std::cout << "字符串中序遍历（字典序）：";
      strRBTree.inOrder();
      std::cout << "查找 'cherry'：" << (strRBTree.contains("cherry") ? "存在" : "不存在") << std::endl;

      return 0;
  }
  ```

### Treap（树堆）

- 树堆（Tree + Heap，也叫随机二叉搜索树）是一种平衡二叉搜索树（BST），它结合了二叉搜索树和堆的特性，通过随机化的优先级来保证树的平衡，避免普通 BST 在有序插入时退化成链表的问题
  - BST 特性：对于任意节点，左子树所有节点值 <节点值，右子树所有节点值> 节点值（保证查找、插入、删除的 BST 逻辑）
  - 堆特性：每个节点额外维护一个随机优先级，满足父节点优先级 > 子节点优先级（小根堆 / 大根堆均可，这里用大根堆）
  - 旋转操作：通过左旋（Left Rotate） 和右旋（Right Rotate） 维护堆特性，同时不破坏 BST 特性

- 核心操作
  - 右旋（zig）：将左子节点提升为父节点，原父节点变为右子节点
  - 左旋（zag）：将右子节点提升为父节点，原父节点变为左子节点
  - 插入：先按 BST 规则插入节点，随机生成优先级，再通过旋转调整堆特性
  - 删除：先按 BST 规则找到节点，再通过旋转将节点降到叶子节点后删除
  - 查找：与普通 BST 查找逻辑一致
  - 前驱 / 后继：查找某个值的前驱（最大的小于该值的节点）、后继（最小的大于该值的节点）

- 完整实现

  ```cpp
  #include <iostream>
  #include <cstdlib>
  #include <ctime>
  using namespace std;

  // Treap节点结构
  struct TreapNode {
      int key;        // 节点存储的值（关键字）
      int priority;   // 随机优先级（堆的关键）
      int size;       // 以该节点为根的子树大小（用于排名/第k大）
      TreapNode *left;
      TreapNode *right;

      // 构造函数
      TreapNode(int k) : key(k), priority(rand()), size(1), left(nullptr), right(nullptr) {}

      // 更新子树大小
      void updateSize() {
          size = 1;
          if (left) size += left->size;
          if (right) size += right->size;
      }
  };

  // 左旋操作（zag）：将右子节点提升为根
  TreapNode* rotateLeft(TreapNode* root) {
      TreapNode* newRoot = root->right;
      root->right = newRoot->left;
      newRoot->left = root;

      // 更新子树大小（先更旧根，再更新新根）
      root->updateSize();
      newRoot->updateSize();
      return newRoot;
  }

  // 右旋操作（zig）：将左子节点提升为根
  TreapNode* rotateRight(TreapNode* root) {
      TreapNode* newRoot = root->left;
      root->left = newRoot->right;
      newRoot->right = root;

      // 更新子树大小
      root->updateSize();
      newRoot->updateSize();
      return newRoot;
  }

  // 插入节点
  TreapNode* insert(TreapNode* root, int key) {
      if (!root) return new TreapNode(key); // 空树，直接创建节点

      // 按BST规则插入
      if (key < root->key) {
          root->left = insert(root->left, key);
          // 左子节点优先级更高，右旋调整堆特性
          if (root->left->priority > root->priority) {
              root = rotateRight(root);
          }
      } else if (key > root->key) {
          root->right = insert(root->right, key);
          // 右子节点优先级更高，左旋调整堆特性
          if (root->right->priority > root->priority) {
              root = rotateLeft(root);
          }
      }
      // 重复key不处理（如需支持重复，可加count字段）

      root->updateSize(); // 更新当前节点的子树大小
      return root;
  }

  // 删除节点
  TreapNode* remove(TreapNode* root, int key) {
      if (!root) return nullptr; // 未找到节点，直接返回

      // 找到要删除的节点
      if (key < root->key) {
          root->left = remove(root->left, key);
      } else if (key > root->key) {
          root->right = remove(root->right, key);
      } else {
          // 叶子节点，直接删除
          if (!root->left && !root->right) {
              delete root;
              return nullptr;
          }

          // 有子节点，旋转后将节点降到叶子
          if (!root->left || (root->right && root->right->priority > root->left->priority)) {
              root = rotateLeft(root); // 右旋？不，左旋：将右子提上来，当前节点到左子树
              root->left = remove(root->left, key);
          } else {
              root = rotateRight(root); // 左旋？不，右旋：将左子提上来，当前节点到右子树
              root->right = remove(root->right, key);
          }
      }

      root->updateSize(); // 更新子树大小
      return root;
  }

  // 查找节点（返回是否存在）
  bool find(TreapNode* root, int key) {
      if (!root) return false;
      if (root->key == key) return true;
      if (key < root->key) return find(root->left, key);
      else return find(root->right, key);
  }

  // 查找key的排名（排名：比key小的数的个数+1）
  int getRank(TreapNode* root, int key) {
      if (!root) return 1; // 空树，排名为1
      if (key <= root->key) {
          return getRank(root->left, key);
      } else {
          int leftSize = root->left ? root->left->size : 0;
          return leftSize + 1 + getRank(root->right, key);
      }
  }

  // 查找第k大的数（k从1开始）
  int getKth(TreapNode* root, int k) {
      if (!root) return -1; // 无效k
      int leftSize = root->left ? root->left->size : 0;
      if (k <= leftSize) {
          return getKth(root->left, k);
      } else if (k == leftSize + 1) {
          return root->key;
      } else {
          return getKth(root->right, k - leftSize - 1);
      }
  }

  // 查找前驱（最大的小于key的数）
  int getPredecessor(TreapNode* root, int key) {
      int pre = -1; // 无前驱时返回-1（可根据需求调整）
      while (root) {
          if (root->key < key) {
              pre = root->key; // 记录可能的前驱
              root = root->right; // 找更大的小于key的数
          } else {
              root = root->left; // 数太大，往左找
          }
      }
      return pre;
  }

  // 查找后继（最小的大于key的数）
  int getSuccessor(TreapNode* root, int key) {
      int suc = -1; // 无后继时返回-1
      while (root) {
          if (root->key > key) {
              suc = root->key; // 记录可能的后继
              root = root->left; // 找更小的大于key的数
          } else {
              root = root->right; // 数太小，往右找
          }
      }
      return suc;
  }

  // 中序遍历（验证BST特性，升序输出）
  void inorder(TreapNode* root) {
      if (!root) return;
      inorder(root->left);
      cout << root->key << " ";
      inorder(root->right);
  }

  // 释放内存（防止内存泄漏）
  void destroyTreap(TreapNode* root) {
      if (!root) return;
      destroyTreap(root->left);
      destroyTreap(root->right);
      delete root;
  }

  // 主函数：演示Treap的使用
  int main() {
      srand(time(0)); // 初始化随机数种子（保证优先级随机）
      TreapNode* root = nullptr;

      // 1. 插入操作
      int nums[] = {5, 3, 7, 1, 4, 6, 8};
      cout << "插入元素：5,3,7,1,4,6,8" << endl;
      for (int num : nums) {
          root = insert(root, num);
      }

      // 2. 中序遍历（验证升序）
      cout << "中序遍历（升序）：";
      inorder(root);
      cout << endl;

      // 3. 查找操作
      int target = 4;
      cout << "查找 " << target << "：" << (find(root, target) ? "存在" : "不存在") << endl;
      target = 9;
      cout << "查找 " << target << "：" << (find(root, target) ? "存在" : "不存在") << endl;

      // 4. 排名操作
      target = 5;
      cout << target << " 的排名：" << getRank(root, target) << endl;

      // 5. 第k大操作
      int k = 3;
      cout << "第 " << k << " 大的数：" << getKth(root, k) << endl;

      // 6. 前驱后继
      target = 5;
      cout << target << " 的前驱：" << getPredecessor(root, target) << endl;
      cout << target << " 的后继：" << getSuccessor(root, target) << endl;

      // 7. 删除操作
      target = 5;
      cout << "删除 " << target << " 后，中序遍历：";
      root = remove(root, target);
      inorder(root);
      cout << endl;

      // 释放内存
      destroyTreap(root);
      return 0;
  }
  ```

### 跳表（Skip List）

- 跳表（Skip List）是一种多层有序链表的概率型数据结构，由 William Pugh 于 1989 年发明，通过多级索引 + 随机平衡，将链表的查找 / 插入 / 删除从 O (n) 优化到平均 O (log n)，实现接近平衡树的性能，同时比红黑树 / AVL 树更易实现、更友好并发
- 核心思想
  - 空间换时间：用多层索引做 “快速通道”，查找时先在高层大步跳跃，再到低层精确定位。
  - 概率平衡：不做严格旋转，用随机算法决定节点层数，天然保持结构平衡
- 跳表由多层有序链表组成，层级越高越稀疏：
  - 第 0 层（底层）：包含所有数据节点，严格有序。
  - 第 1 层、第 2 层… 第 maxLevel 层：索引层，是下一层的子集，节点更稀疏
  - 头节点（head）：无实际数据，层数等于当前最大层数，所有操作从它开始
  - 节点结构：每个节点含key/value + 多层前进指针数组 + 当前最大层数
- 层数生成
  - 新节点默认在第 0 层，通过抛硬币式随机决定是否晋升上层：
    - 概率 `p`（常用 0.5 或 0.25）决定是否多一层
    - 设最大层数 `maxLevel`（通常取 `log(1/p) n`，如 32/64）
  - 示例（p=0.5）：50% 概率到 1 层，25% 到 2 层，12.5% 到 3 层…
- 典型应用
  - Redis 有序集合（ZSet）：用哈希表 + 跳表，单点 O (1)、范围 / 排名 O (log n)
  - LevelDB/RocksDB：内存中用跳表做有序索引，磁盘用 LSM-Tree
  - 内存数据库 / 缓存：需要高效有序遍历、范围查询的场景

## B 树

- B 树（Balanced Tree）是一种多路平衡查找树，m 阶 B 树 是「多路」树（一个节点可有 m 个子节点），所有叶子节点在同一层，专为磁盘 IO 优化设计

- 与平衡二叉树的对比：

  | 特性         | 平衡二叉树（AVL / 红黑树）            | B 树（m 阶）                                                           |
  | :----------- | :------------------------------------ | :--------------------------------------------------------------------- |
  | 子节点数量   | 每个节点最多 2 个子节点（二叉）       | 每个节点最多 m 个子节点（多路，m 通常远大于 2，如 m=100）              |
  | 节点存储内容 | 仅存「1 个关键字 + 2 个指针」         | 存「k 个关键字 + k+1 个指针」（k ≤ m-1），非叶子节点还可存数据（B 树） |
  | 树高         | 高（log₂n），比如 n=100 万时，树高≈20 | 极低（logₘn），比如 m=100 时，n=100 万的树高≈3                         |

- 平衡二叉树：
  - 设计目标是优化内存中的数据访问—— 内存的访问速度极快（纳秒级），瓶颈在于 “比较次数”，二叉结构的比较逻辑简单，O (logn) 的比较次数在内存中完全可接受
  - 缺点：树高太高，若用于磁盘，每次访问节点都要一次磁盘 IO（毫秒级），20 次 IO 的耗时完全无法接受
  - 严格平衡 —— 任意节点左右子树高度差≤1，插入 / 删除时通过旋转（左旋 / 右旋） 调整平衡，调整范围是 “局部子树”（影响节点少，内存中操作快）
  - 红黑树是 “弱平衡”（黑高平衡），旋转次数更少，实际工程中比 AVL 更常用（如 C++ STL 的 map/set）
- B 树：
  - 设计目标是最小化磁盘 IO 次数—— 磁盘 IO 是外存访问的核心开销（毫秒级，比内存慢百万倍），因此 B 树通过 “多路” 设计降低树高，把树高控制在 3-4 层（即使数据量上亿），这样查找任意数据最多只需 3-4 次磁盘 IO，大幅降低耗时
  - 缺点：节点内关键字多，内存中比较的开销略高，但相比磁盘 IO 可忽略
  - 全局平衡 —— 所有叶子节点必须在同一层，插入 / 删除时通过节点分裂 / 合并 调整平衡：
    - 插入：节点关键字数量超过上限 → 分裂成两个节点，中间关键字提升到父节点；
    - 删除：节点关键字数量低于下限 → 合并相邻节点，或向兄弟节点借关键字
    - 调整范围可能涉及整个路径（从叶子到根），但因树高极低，实际 IO 次数仍可控
  - 一般用于数据库索引（MySQL 的非聚簇索引）、文件系统目录索引
- 为什么数据库索引不用红黑树而用 B + 树（B 树变种）：
  1.  红黑树树高太高（log₂n），磁盘 IO 次数多；B + 树树高极低（logₘn），IO 次数少；
  2.  红黑树不支持高效范围查询；B + 树叶子节点链式连接，范围查询只需遍历链表；
  3.  红黑树节点存储密度低（仅 1 个关键字）；B + 树非叶子节点仅存索引，存储密度更高，树高更低

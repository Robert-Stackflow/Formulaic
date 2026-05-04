---
title: 链表
description: 链表的基本性质、操作、常见算法等常用技巧
---

## 链表基础知识

- 单链表
  - 每个节点包含 next 指针指向下一个节点和自己存储的数据
  - 第一个节点称为 head，最后一个节点的 next 指针为 null

- 双链表
  - 每个节点包含 pre 指针指向上一个节点，next 指针指向下一个节点
  - head 节点的 pre 指针和最后一个节点的 next 指针均为 null

- 循环链表
  - 最后一个节点的 next 指针为 head
  - 可以用来解决约瑟夫环问题

- 链表的存储方式
  - 数组是在内存中是连续分布的，但是链表在内存中不是连续分布的
  - 链表是通过指针域的指针链接在内存中各个节点
  - 所以链表中的节点在内存中不是连续分布的 ，而是散乱分布在内存中的某地址上，分配机制取决于操作系统的内存管理

- 链表节点的定义

  ```cpp
  // 单链表
  struct ListNode {
      int val;  // 节点上存储的元素
      ListNode *next;  // 指向下一个节点的指针
      ListNode(int x) : val(x), next(NULL) {}  // 节点的构造函数
  };

  ListNode* head = new ListNode(5);
  ListNode* head = new ListNode();
  head->val = 5;
  ```

- 删除节点：如原先为 `A→B→C`，那么删除节点 B 后，节点 A 的 next 指针应该指向节点 C；同时，在 C++ 中，应该释放节点 C 的内存；时间复杂度为 $O(1)$

- 添加节点：如原先为 `A→B→D`，要在节点 B 和节点 D之间添加新的节点 C，那么节点 B 的 next 指针应该指向节点 C，节点 C 的 next 指针应该指向节点 D；时间复杂度为 $O(1)$

- 但注意在删除和添加操作中，查询要删除的节点或待添加节点的插入位置的时间复杂度都是 $O(n)$

## 设计链表

- 在链表类中实现这些功能：
  - get(index)：获取链表中第 index 个节点的值。如果索引无效，则返回-1
  - addAtHead(val)：在链表的第一个元素之前添加一个值为 val 的节点。插入后，新节点将成为链表的第一个节点
  - addAtTail(val)：将值为 val 的节点追加到链表的最后一个元素
  - addAtIndex(index,val)：在链表中的第 index 个节点之前添加值为 val 的节点。如果 index 等于链表的长度，则该节点将附加到链表的末尾。如果 index 大于链表长度，则不会插入节点。如果index小于0，则在头部插入节点
  - deleteAtIndex(index)：如果索引 index 有效，则删除链表中的第 index 个节点

- 链表操作可以有两种方式：
  - 直接使用原来的链表进行操作
  - 设置一个虚拟的头节点进行操作

- 具体实现（虚拟头节点）

  ```cpp
  class MyLinkedList {
  public:
      // 定义链表节点结构体
      struct LinkedNode {
          int val;
          LinkedNode* next;
          LinkedNode(int val):val(val), next(nullptr){}
      };

      // 初始化链表
      MyLinkedList() {
          _dummyHead = new LinkedNode(0); // 这里定义的头结点 是一个虚拟头结点，而不是真正的链表头结点
          _size = 0;
      }

      // 获取到第index个节点数值，如果index是非法数值直接返回-1， 注意index是从0开始的，第0个节点就是头结点
      int get(int index) {
          if (index > (_size - 1) || index < 0) {
              return -1;
          }
          LinkedNode* cur = _dummyHead->next;
          while(index--){ // 如果--index 就会陷入死循环
              cur = cur->next;
          }
          return cur->val;
      }

      // 在链表最前面插入一个节点，插入完成后，新插入的节点为链表的新的头结点
      void addAtHead(int val) {
          LinkedNode* newNode = new LinkedNode(val);
          newNode->next = _dummyHead->next;
          _dummyHead->next = newNode;
          _size++;
      }

      // 在链表最后面添加一个节点
      void addAtTail(int val) {
          LinkedNode* newNode = new LinkedNode(val);
          LinkedNode* cur = _dummyHead;
          while(cur->next != nullptr){
              cur = cur->next;
          }
          cur->next = newNode;
          _size++;
      }

      // 在第index个节点之前插入一个新节点，例如index为0，那么新插入的节点为链表的新头节点。
      // 如果index 等于链表的长度，则说明是新插入的节点为链表的尾结点
      // 如果index大于链表的长度，则返回空
      // 如果index小于0，则在头部插入节点
      void addAtIndex(int index, int val) {

          if(index > _size) return;
          if(index < 0) index = 0;
          LinkedNode* newNode = new LinkedNode(val);
          LinkedNode* cur = _dummyHead;
          while(index--) {
              cur = cur->next;
          }
          newNode->next = cur->next;
          cur->next = newNode;
          _size++;
      }

      // 删除第index个节点，如果index 大于等于链表的长度，直接return，注意index是从0开始的
      void deleteAtIndex(int index) {
          if (index >= _size || index < 0) {
              return;
          }
          LinkedNode* cur = _dummyHead;
          while(index--) {
              cur = cur ->next;
          }
          LinkedNode* tmp = cur->next;
          cur->next = cur->next->next;
          delete tmp;
          //delete命令指示释放了tmp指针原本所指的那部分内存，
          //被delete后的指针tmp的值（地址）并非就是NULL，而是随机值。也就是被delete后，
          //如果不再加上一句tmp=nullptr,tmp会成为乱指的野指针
          //如果之后的程序不小心使用了tmp，会指向难以预想的内存空间
          tmp=nullptr;
          _size--;
      }

      // 打印链表
      void printLinkedList() {
          LinkedNode* cur = _dummyHead;
          while (cur->next != nullptr) {
              cout << cur->next->val << " ";
              cur = cur->next;
          }
          cout << endl;
      }
  private:
      int _size;
      LinkedNode* _dummyHead;

  };
  ```

- 双链表实现

  ```cpp
  //采用循环虚拟结点的双链表实现
  class MyLinkedList {
  public:
      // 定义双向链表节点结构体
      struct DList {
          int elem; // 节点存储的元素
          DList *next; // 指向下一个节点的指针
          DList *prev; // 指向上一个节点的指针
          // 构造函数，创建一个值为elem的新节点
          DList(int elem) : elem(elem), next(nullptr), prev(nullptr) {};
      };

      // 构造函数，初始化链表
      MyLinkedList() {
          sentinelNode = new DList(0); // 创建哨兵节点，不存储有效数据
          sentinelNode->next = sentinelNode; // 哨兵节点的下一个节点指向自身，形成循环
          sentinelNode->prev = sentinelNode; // 哨兵节点的上一个节点指向自身，形成循环
          size = 0; // 初始化链表大小为0
      }

      // 获取链表中第index个节点的值
      int get(int index) {
          if (index > (size - 1) || index < 0) { // 检查索引是否超出范围
              return -1; // 如果超出范围，返回-1
          }
          int num;
          int mid = size >> 1; // 计算链表中部位置
          DList *curNode = sentinelNode; // 从哨兵节点开始
          if (index < mid) { // 如果索引小于中部位置，从前往后遍历
              for (int i = 0; i < index + 1; i++) {
                  curNode = curNode->next; // 移动到目标节点
              }
          } else { // 如果索引大于等于中部位置，从后往前遍历
              for (int i = 0; i < size - index; i++) {
                  curNode = curNode->prev; // 移动到目标节点
              }
          }
          num = curNode->elem; // 获取目标节点的值
          return num; // 返回节点的值
      }

      // 在链表头部添加节点
      void addAtHead(int val) {
          DList *newNode = new DList(val); // 创建新节点
          DList *next = sentinelNode->next; // 获取当前头节点的下一个节点
          newNode->prev = sentinelNode; // 新节点的上一个节点指向哨兵节点
          newNode->next = next; // 新节点的下一个节点指向原来的头节点
          size++; // 链表大小加1
          sentinelNode->next = newNode; // 哨兵节点的下一个节点指向新节点
          next->prev = newNode; // 原来的头节点的上一个节点指向新节点
      }

      // 在链表尾部添加节点
      void addAtTail(int val) {
          DList *newNode = new DList(val); // 创建新节点
          DList *prev = sentinelNode->prev; // 获取当前尾节点的上一个节点
          newNode->next = sentinelNode; // 新节点的下一个节点指向哨兵节点
          newNode->prev = prev; // 新节点的上一个节点指向原来的尾节点
          size++; // 链表大小加1
          sentinelNode->prev = newNode; // 哨兵节点的上一个节点指向新节点
          prev->next = newNode; // 原来的尾节点的下一个节点指向新节点
      }

      // 在链表中的第index个节点之前添加值为val的节点
      void addAtIndex(int index, int val) {
          if (index > size) { // 检查索引是否超出范围
              return; // 如果超出范围，直接返回
          }
          if (index <= 0) { // 如果索引为0或负数，在头部添加节点
              addAtHead(val);
              return;
          }
          int num;
          int mid = size >> 1; // 计算链表中部位置
          DList *curNode = sentinelNode; // 从哨兵节点开始
          if (index < mid) { // 如果索引小于中部位置，从前往后遍历
              for (int i = 0; i < index; i++) {
                  curNode = curNode->next; // 移动到目标位置的前一个节点
              }
              DList *temp = curNode->next; // 获取目标位置的节点
              DList *newNode = new DList(val); // 创建新节点
              curNode->next = newNode; // 在目标位置前添加新节点
              temp->prev = newNode; // 目标位置的节点的前一个节点指向新节点
              newNode->next = temp; // 新节点的下一个节点指向目标位置的结点
              newNode->prev = curNode; // 新节点的上一个节点指向当前节点
          } else { // 如果索引大于等于中部位置，从后往前遍历
              for (int i = 0; i < size - index; i++) {
                  curNode = curNode->prev; // 移动到目标位置的后一个节点
              }
              DList *temp = curNode->prev; // 获取目标位置的节点
              DList *newNode = new DList(val); // 创建新节点
              curNode->prev = newNode; // 在目标位置后添加新节点
              temp->next = newNode; // 目标位置的节点的下一个节点指向新节点
              newNode->prev = temp; // 新节点的上一个节点指向目标位置的节点
              newNode->next = curNode; // 新节点的下一个节点指向当前节点
          }
          size++; // 链表大小加1
      }

      // 删除链表中的第index个节点
      void deleteAtIndex(int index) {
          if (index > (size - 1) || index < 0) { // 检查索引是否超出范围
              return; // 如果超出范围，直接返回
          }
          int num;
          int mid = size >> 1; // 计算链表中部位置
          DList *curNode = sentinelNode; // 从哨兵节点开始
          if (index < mid) { // 如果索引小于中部位置，从前往后遍历
              for (int i = 0; i < index; i++) {
                  curNode = curNode->next; // 移动到目标位置的前一个节点
              }
              DList *next = curNode->next->next; // 获取目标位置的下一个节点
              curNode->next = next; // 删除目标位置的节点
              next->prev = curNode; // 目标位置的下一个节点的前一个节点指向当前节点
          } else { // 如果索引大于等于中部位置，从后往前遍历
              for (int i = 0; i < size - index - 1; i++) {
                  curNode = curNode->prev; // 移动到目标位置的后一个节点
              }
              DList *prev = curNode->prev->prev; // 获取目标位置的下一个节点
              curNode->prev = prev; // 删除目标位置的节点
              prev->next = curNode; // 目标位置的下一个节点的下一个节点指向当前节点
          }
          size--; // 链表大小减1
      }

  private:
      int size; // 链表的大小
      DList *sentinelNode; // 哨兵节点的指针
  };
  ```

## 删除节点

### 移除链表元素

- 题目要求：删除链表中等于给定值 val 的所有节点

- 直接在原来的链表进行移除节点操作（时间复杂度 $O(n)$，空间复杂度 $O(1)$）

  ```cpp
  class Solution {
  public:
      ListNode* removeElements(ListNode* head, int val) {
          // 删除头结点
          while (head != NULL && head->val == val) { // 注意这里不是if
              ListNode* tmp = head;
              head = head->next;
              delete tmp;
          }

          // 删除非头结点
          ListNode* cur = head;
          while (cur != NULL && cur->next!= NULL) {
              if (cur->next->val == val) {
                  ListNode* tmp = cur->next;
                  cur->next = cur->next->next;
                  delete tmp;
              } else {
                  cur = cur->next;
              }
          }
          return head;
      }
  };
  ```

- 设置一个虚拟头结点在进行移除节点操作（时间复杂度 $O(n)$，空间复杂度 $O(1)$）

  ```cpp
  class Solution {
  public:
      ListNode* removeElements(ListNode* head, int val) {
          ListNode* dummyHead = new ListNode(0); // 设置一个虚拟头结点
          dummyHead->next = head; // 将虚拟头结点指向head，这样方便后面做删除操作
          ListNode* cur = dummyHead;
          while (cur->next != NULL) {
              if(cur->next->val == val) {
                  ListNode* tmp = cur->next;
                  cur->next = cur->next->next;
                  delete tmp;
              } else {
                  cur = cur->next;
              }
          }
          head = dummyHead->next;
          delete dummyHead;
          return head;
      }
  };
  ```

- 递归思路（时间复杂度 $O(n)$，空间复杂度 $O(n)$）

  ```cpp
  class Solution {
  public:
      ListNode* removeElements(ListNode* head, int val) {
          // 基础情况：空链表
          if (head == nullptr) {
              return nullptr;
          }

          // 递归处理
          if (head->val == val) {
              ListNode* newHead = removeElements(head->next, val);
              delete head;
              return newHead;
          } else {
              head->next = removeElements(head->next, val);
              return head;
          }
      }
  };
  ```

- 参考题目
  - [203. 移除链表元素](https://leetcode.cn/problems/remove-linked-list-elements/description/)

### 从链表中移除节点

- 题目：[2487. 从链表中移除节点](https://leetcode.cn/problems/remove-nodes-from-linked-list/)

- 可以递归实现

  ```cpp
  class Solution {
  public:
      ListNode *removeNodes(ListNode *head) {
          if (head->next == nullptr) {
              return head;
          }
          ListNode *node = removeNodes(head->next); // 返回的链表头一定是最大的
          if (node->val > head->val) {
              return node; // 删除 head
          }
          head->next = node; // 不删除 head
          return head;
      }
  };
  ```

- 也可以先反转链表，用迭代法做

  ```cpp
  class Solution {
      ListNode *reverseList(ListNode *head) {
          ListNode *pre = nullptr, *cur = head;
          while (cur) {
              ListNode *nxt = cur->next;
              cur->next = pre;
              pre = cur;
              cur = nxt;
          }
          return pre;
      }
  public:
      ListNode *removeNodes(ListNode *head) {
          head = reverseList(head);
          ListNode *cur = head;
          while (cur->next) {
              if (cur->val > cur->next->val) {
                  cur->next = cur->next->next;
              } else {
                  cur = cur->next;
              }
          }
          return reverseList(head);
      }
  };
  ```

- 可以用单调栈做，最后栈中的元素就是没有下一个最大值的元素

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* removeNodes(ListNode* head) {
          ListNode* cur = head;
          stack<ListNode*> st;
          while (cur != nullptr) {
              while (!st.empty() && st.top()->val < cur->val) {
                  st.pop();
              }
              st.push(cur);
              cur = cur->next;
          }
          ListNode* dummy = new ListNode(0, nullptr);
          while (!st.empty()) {
              ListNode* top = st.top();
              top->next = dummy->next;
              dummy->next = top;
              st.pop();
          }
          return dummy->next;
      }
  };
  ```

## 反转链表

### 反转链表

- 题目要求：反转一个链表

- 定义一个新的链表，实现反转

  ```cpp
  #include <iostream>
  using namespace std;

  // 定义链表节点结构体
  struct ListNode {
      int val;
      ListNode* next;
      ListNode(int x) : val(x), next(nullptr) {}
  };

  // 创建新链表（新建节点，不修改原链表）
  ListNode* reverseByNewNodes(ListNode* head) {
      ListNode* new_head = nullptr;
      ListNode* curr = head;

      while (curr != nullptr) {
          // 1. 新建一个和当前节点值相同的节点
          ListNode* new_node = new ListNode(curr->val);
          // 2. 新节点的next指向新链表的头节点（头插）
          new_node->next = new_head;
          // 3. 更新新链表的头节点
          new_head = new_node;
          // 4. 遍历原链表下一个节点
          curr = curr->next;
      }

      return new_head;
  }
  ```

- 记录中间变量进行反转（时间复杂度 $O(n)$，空间复杂度 $O(1)$）

  ```cpp
  #include <iostream>
  using namespace std;

  // 定义链表节点结构体
  struct ListNode {
      int val;          // 节点值
      ListNode* next;   // 指向下一个节点的指针
      // 构造函数，方便创建节点
      ListNode(int x) : val(x), next(nullptr) {}
  };

  // 迭代法反转链表
  ListNode* reverseLinkedList(ListNode* head) {
      ListNode* prev = nullptr;  // 前一个节点，初始为空
      ListNode* curr = head;     // 当前节点，初始指向头节点
      ListNode* next_temp;       // 临时保存下一个节点

      while (curr != nullptr) {
          // 1. 先保存当前节点的下一个节点（避免修改后丢失）
          next_temp = curr->next;
          // 2. 反转当前节点的指向：指向prev
          curr->next = prev;
          // 3. prev指针后移（指向当前节点）
          prev = curr;
          // 4. curr指针后移（指向之前保存的下一个节点）
          curr = next_temp;
      }
      // 循环结束后，prev指向原链表的最后一个节点，即反转后的头节点
      return prev;
  }
  ```

- 使用双指针法

  ```cpp
  #include <iostream>
  using namespace std;

  // 定义链表节点
  struct ListNode {
      int val;
      ListNode* next;
      ListNode(int x) : val(x), next(nullptr) {}
  };

  // 双指针法反转链表
  ListNode* reverseListWithTwoPointers(ListNode* head) {
      ListNode* pre = nullptr;  // 已反转部分的头节点
      ListNode* cur = head;     // 待反转部分的头节点

      while (cur != nullptr) {
          // 临时保存cur的下一个节点（仅为辅助，非核心指针）
          ListNode* temp = cur->next;
          // 核心：反转cur的指向，指向已反转部分的头节点pre
          cur->next = pre;
          // 双指针同步后移：pre接管cur（成为新的已反转头），cur接管temp（待反转头）
          pre = cur;
          cur = temp;
      }
      // 循环结束后，pre是反转后的头节点
      return pre;
  }
  ```

- 双指针法本质是迭代法的简化表述，仅用两个指针（而非显式的三个）完成反转，核心逻辑：
  - pre 指针：指向已反转部分的头节点（初始为 `nullptr`）；
  - `cur` 指针：指向待反转部分的头节点（初始为原链表头节点）；
  - 每次循环中，先临时记录 `cur->next`（避免丢失后续节点），再将 `cur` 的 `next` 指向 `pre`，然后同步后移 `pre` 和 `cur`，直到 `cur` 为空
  - 这里 “双指针” 指核心的 `pre` 和 `cur`，临时变量仅为辅助，不视为第三个指针

- 递归法（时间复杂度 $O(n)$，空间复杂度 $O(n)$）

  ```cpp
  class Solution {
  public:
      ListNode* reverse(ListNode* pre,ListNode* cur){
          if(cur == NULL) return pre;
          ListNode* temp = cur->next;
          cur->next = pre;
          // 可以和双指针法的代码进行对比，如下递归的写法，其实就是做了这两步
          // pre = cur;
          // cur = temp;
          return reverse(cur,temp);
      }
      ListNode* reverseList(ListNode* head) {
          // 和双指针法初始化是一样的逻辑
          // ListNode* cur = head;
          // ListNode* pre = NULL;
          return reverse(NULL, head);
      }

  };
  ```

- 上面的递归写法和双指针法实质上都是从前往后翻转指针指向，还有另外一种与双指针法不同思路的递归写法：从后往前翻转指针指向

  ```cpp
  class Solution {
  public:
      ListNode* reverseList(ListNode* head) {
          // 边缘条件判断
          if(head == NULL) return NULL;
          if (head->next == NULL) return head;

          // 递归调用，翻转第二个节点开始往后的链表
          ListNode *last = reverseList(head->next);
          // 翻转头节点与第二个节点的指向
          head->next->next = head;
          // 此时的 head 节点为尾节点，next 需要指向 NULL
          head->next = NULL;
          return last;
      }
  };
  ```

- 参考题目
  - [206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/description/)
  - [92. 反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii/description/)

### 反转链表 II

- 代码实现

  ```cpp
  class Solution {
  public:
      ListNode* reverseBetween(ListNode* head, int left, int right) {
          ListNode dummy(0, head);
          ListNode* p0 = &dummy;
          for (int i = 0; i < left - 1; i++) {
              p0 = p0->next;
          }

          ListNode* pre = nullptr;
          ListNode* cur = p0->next;
          for (int i = 0; i < right - left + 1; i++) {
              ListNode* nxt = cur->next;
              cur->next = pre; // 每次循环只修改一个 next，方便大家理解
              pre = cur;
              cur = nxt;
          }

          // 见视频
          p0->next->next = cur;
          p0->next = pre;
          return dummy.next;
      }
  };
  ```

- 我的实现

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* reverseBetween(ListNode* head, int left, int right) {
          if (head == nullptr)
              return head;
          int idx = 0;
          ListNode* dummy = new ListNode(0, head);
          ListNode *cur = head, *pre = dummy;
          ListNode *tmpFirst = nullptr, *tmpTail = nullptr, *tmpHead = nullptr;
          while (cur != nullptr) {
              ListNode* tmp = cur->next;
              if (idx == left - 1) {
                  tmpFirst = pre;
              }
              if (idx == left) {
                  tmpTail = pre;
              }
              if (idx >= left && idx < right) {
                  cur->next = pre;
              }
              if (idx == right) {
                  break;
              }
              idx++;
              pre = cur;
              cur = tmp;
          }
          tmpHead = pre;
          if (tmpFirst != nullptr)
              tmpFirst->next = tmpHead;
          if (tmpTail != nullptr)
              tmpTail->next = cur;
          return dummy->next;
      }
  };
  ```

### 两两交换链表元素

- 给定一个链表，两两交换其中相邻的节点，并返回交换后的链表；不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换

- 代码实现

  ```cpp
  class Solution {
  public:
      ListNode* swapPairs(ListNode* head) {
          ListNode* dummyHead = new ListNode(0); // 设置一个虚拟头结点
          dummyHead->next = head; // 将虚拟头结点指向head，这样方便后面做删除操作
          ListNode* cur = dummyHead;
          while(cur->next != nullptr && cur->next->next != nullptr) {
              ListNode* tmp = cur->next; // 记录临时节点
              ListNode* tmp1 = cur->next->next->next; // 记录临时节点

              cur->next = cur->next->next;    // 步骤一
              cur->next->next = tmp;          // 步骤二
              cur->next->next->next = tmp1;   // 步骤三

              cur = cur->next->next; // cur移动两位，准备下一轮交换
          }
          ListNode* result = dummyHead->next;
          delete dummyHead;
          return result;
      }
  };
  ```

- 参考题目
  - [24. 两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/description/)

- 我的实现

  ```cpp
  class Solution {
  public:
      ListNode* swapPairs(ListNode* head) {
          ListNode* dummy = new ListNode(0, head);
          ListNode *cur = head, *pre = dummy;
          while (cur != nullptr && cur->next != nullptr) {
              ListNode* nxt = cur->next;
              cur->next = nxt->next;
              nxt->next = cur;
              pre->next = nxt;
              pre = cur;
              cur = cur->next;
          }
          return dummy->next;
      }
  };
  ```

### K个一组反转链表

- 题目：[25. K 个一组翻转链表 - 力扣（LeetCode）](https://leetcode.cn/problems/reverse-nodes-in-k-group/)

- 代码实现

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* reverseList(ListNode* head) {
          if (head == nullptr)
              return head;
          ListNode *cur = head, *pre = nullptr;
          while (cur != nullptr) {
              ListNode* tmp = cur->next;
              cur->next = pre;
              pre = cur;
              cur = tmp;
          }
          return pre;
      }
      ListNode* reverseKGroup(ListNode* head, int k) {
          if (k == 1)
              return head;
          int idx = 1;
          ListNode* dummy = new ListNode(0, head);
          ListNode *cur = head, *pre = dummy;
          while (cur != nullptr) {
              if (idx % k == 0) {
                  ListNode* nxt = cur->next;
                  ListNode* begin = pre->next;
                  cur->next = nullptr;
                  ListNode* newHead = reverseList(begin);
                  begin->next = nxt;
                  pre->next = newHead;
                  cur = nxt;
                  idx++;
                  pre = begin;
              }
              idx++;
              cur = cur->next;
          }
          return dummy->next;
      }
  };
  ```

- 简洁代码

  ```cpp
  class Solution {
  public:
      ListNode* reverseKGroup(ListNode* head, int k) {
          // 统计节点个数
          int n = 0;
          for (ListNode* cur = head; cur; cur = cur->next) {
              n++;
          }

          ListNode dummy(0, head);
          ListNode* p0 = &dummy;
          ListNode* pre = nullptr;
          ListNode* cur = head;

          // k 个一组处理
          for (; n >= k; n -= k) {
              for (int i = 0; i < k; i++) { // 同 92 题
                  ListNode* nxt = cur->next;
                  cur->next = pre; // 每次循环只修改一个 next，方便大家理解
                  pre = cur;
                  cur = nxt;
              }

              // 见视频
              ListNode* nxt = p0->next;
              p0->next->next = cur;
              p0->next = pre;
              p0 = nxt;
          }
          return dummy.next;
      }
  };
  ```

### 反转偶数长度组的节点

- 题目：[2074. 反转偶数长度组的节点](https://leetcode.cn/problems/reverse-nodes-in-even-length-groups/description/)

- 代码实现

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* reverseList(ListNode* head) {
          ListNode* prev = nullptr;
          ListNode* curr = head;
          while (curr != nullptr) {
              ListNode* next = curr->next;
              curr->next = prev;
              prev = curr;
              curr = next;
          }
          return prev;
      }
      ListNode* reverseEvenLengthGroups(ListNode* head) {
          ListNode* dummy = new ListNode(0, head);
          ListNode* pre = dummy;
          int k = 1;
          while (true) {
              ListNode* tail = pre->next;
              int count = k - 1;
              while (tail != nullptr && count > 0) {
                  tail = tail->next;
                  count--;
              }
              if ((tail != nullptr && k % 2 == 0) ||
                  (tail == nullptr && (k - count) % 2 == 1)) {
                  ListNode* nextSegHead = tail == nullptr ? nullptr : tail->next;
                  if (tail != nullptr)
                      tail->next = nullptr;
                  ListNode* reversedHead = reverseList(pre->next);
                  pre->next = reversedHead;
                  while (pre->next != nullptr) {
                      pre = pre->next;
                  }
                  pre->next = nextSegHead;
              } else {
                  pre = tail;
              }
              if (tail == nullptr)
                  break;
              k++;
          }
          ListNode* result = dummy->next;
          delete dummy;
          return result;
      }
  };
  ```

## 前后指针

### 删除倒数第 N 个节点

- 给定一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点；只用一遍扫描实现

- 两次遍历法：
  - 第一次遍历：统计出整个链表的总长度 `length`
  - 第二次遍历：计算出要删除的节点是正数第 `length - n` 个节点（注意链表节点从 0 开始计数），然后找到该节点的前驱节点，跳过要删除的节点即可
  - 引入虚拟头节点，避免删除头节点的特殊情况

- 双指针法：先让快指针（fast）向前移动 n 步，随后快慢指针（fast、slow）同步向后遍历，直到快指针到达链表末尾。此时慢指针（slow）恰好指向待删除节点的前驱节点，直接修改指针即可完成删除

- 同时，使用虚拟头节点（dummy）：如果要删除的是原链表的头节点（比如链表只有 1 个节点，删除倒数第 1 个），直接操作原头节点会很麻烦，虚拟头节点统一了所有节点的删除逻辑

- 代码实现

  ```cpp
  class Solution {
  public:
      ListNode* removeNthFromEnd(ListNode* head, int n) {
          ListNode* dummyHead = new ListNode(0);
          dummyHead->next = head;
          ListNode* slow = dummyHead;
          ListNode* fast = dummyHead;
          while(n-- && fast != NULL) {
              fast = fast->next;
          }
          fast = fast->next; // fast再提前走一步，因为需要让slow指向删除节点的上一个节点
          while (fast != NULL) {
              fast = fast->next;
              slow = slow->next;
          }
          slow->next = slow->next->next;

          // ListNode *tmp = slow->next;  C++释放内存的逻辑
          // slow->next = tmp->next;
          // delete tmp;

          return dummyHead->next;
      }
  };
  ```

- 参考题目
  - [19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/description/)

### 交换两个节点

- 题目：[1721. 交换链表中的节点](https://leetcode.cn/problems/swapping-nodes-in-a-linked-list/)

- 代码实现

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* swapNodes(ListNode* head, int k) {
          // 空链表或只有一个节点，直接返回
          if (head == nullptr || head->next == nullptr) {
              return head;
          }

          // 步骤1：找到正数第 k 个节点
          ListNode* forward = head;
          for (int i = 1; i < k; ++i) {
              forward = forward->next;
              // 防止 k 超出链表长度
              if (forward == nullptr) {
                  return head;
              }
          }

          // 步骤2：找到倒数第 k 个节点（快慢指针）
          ListNode* backward = head;
          ListNode* fast = head;
          // 快指针先移动 k 步
          for (int i = 1; i < k; ++i) {
              fast = fast->next;
          }
          // 快慢指针同时移动，直到快指针到末尾
          while (fast->next != nullptr) {
              fast = fast->next;
              backward = backward->next;
          }

          // 步骤3：交换两个节点的值
          if (forward != backward) { // 避免自身交换（无意义）
              int temp = forward->val;
              forward->val = backward->val;
              backward->val = temp;
          }

          return head;
      }
  };
  ```

- 指针交换

  ```cpp
  class Solution {
  public:
      ListNode* swapNodes(ListNode* head, int k) {
          // 空链表或只有一个节点，直接返回
          if (head == nullptr || head->next == nullptr) {
              return head;
          }

          // 步骤1：找到正数第k个节点及其前驱节点
          ListNode *prev_forward = nullptr;
          ListNode *forward = head;
          for (int i = 1; i < k; ++i) {
              prev_forward = forward;
              forward = forward->next;
              // k 超出链表长度，直接返回原链表
              if (forward == nullptr) {
                  return head;
              }
          }

          // 步骤2：找到倒数第k个节点及其前驱节点（快慢指针）
          ListNode *prev_backward = nullptr;
          ListNode *backward = head;
          ListNode *fast = head;
          // 快指针先移动k步
          for (int i = 1; i < k; ++i) {
              fast = fast->next;
          }
          // 快慢指针同时移动，直到快指针到末尾
          while (fast->next != nullptr) {
              fast = fast->next;
              prev_backward = backward;
              backward = backward->next;
          }

          // 步骤3：如果两个节点是同一个，无需交换
          if (forward == backward) {
              return head;
          }

          // 步骤4：处理相邻节点的情况（forward 在 backward 前面）
          if (forward->next == backward) {
              // 调整前驱节点指向
              if (prev_forward != nullptr) {
                  prev_forward->next = backward;
              } else {
                  // forward 是头节点，交换后 backward 变为头节点
                  head = backward;
              }
              // 调整相邻节点的指针
              forward->next = backward->next;
              backward->next = forward;
              return head;
          }

          // 步骤5：处理相邻节点的情况（backward 在 forward 前面）
          if (backward->next == forward) {
              if (prev_backward != nullptr) {
                  prev_backward->next = forward;
              } else {
                  // backward 是头节点，交换后 forward 变为头节点
                  head = forward;
              }
              backward->next = forward->next;
              forward->next = backward;
              return head;
          }

          // 步骤6：处理非相邻节点的通用情况
          // 1. 保存 forward 的后继节点
          ListNode *temp_forward_next = forward->next;
          // 2. 调整 forward 的前驱指向 backward
          if (prev_forward != nullptr) {
              prev_forward->next = backward;
          } else {
              // forward 是头节点，更新头节点为 backward
              head = backward;
          }
          // 3. 调整 backward 的前驱指向 forward
          if (prev_backward != nullptr) {
              prev_backward->next = forward;
          } else {
              // backward 是头节点，更新头节点为 forward
              head = forward;
          }
          // 4. 交换两个节点的后继指针
          forward->next = backward->next;
          backward->next = temp_forward_next;

          return head;
      }
  };
  ```

### 旋转链表

- 题目：[61. 旋转链表](https://leetcode.cn/problems/rotate-list/description/)

- 代码实现

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* rotateRight(ListNode* head, int k) {
          if (head == nullptr)
              return head;
          int n = 0;
          ListNode* cur = head;
          while (cur != nullptr) {
              cur = cur->next;
              n++;
          }
          k = k % n;
          if (k == 0)
              return head;
          ListNode *slow = head, *fast = head;
          while (k--) {
              fast = fast->next;
          }
          while (fast->next != nullptr) {
              fast = fast->next;
              slow = slow->next;
          }
          ListNode* newHead = slow->next;
          fast->next = head;
          slow->next = nullptr;
          return newHead;
      }
  };
  ```

## 快慢指针

### 链表的中间节点

- 题目：[876. 链表的中间结点 - 力扣（LeetCode）](https://leetcode.cn/problems/middle-of-the-linked-list/description/)

- 代码实现

  ```cpp
  class Solution {
  public:
      ListNode* middleNode(ListNode* head) {
          ListNode *slow = head, *fast = head;
          while (fast != nullptr && fast->next != nullptr) {
              slow = slow->next;
              fast = fast->next->next;
          }
          return slow;
      }
  };
  ```

### 删除链表的中间节点

- 题目

- 代码实现

  ```cpp
  class Solution {
  public:
      ListNode* deleteMiddle(ListNode* head) {
          ListNode *slow = head, *fast = head;
          if (fast == nullptr || fast->next == nullptr)
              return nullptr;
          fast = fast->next->next;
          while (fast != nullptr && fast->next != nullptr) {
              slow = slow->next;
              fast = fast->next->next;
          }
          slow->next = slow->next->next;
          return head;
      }
  };
  ```

### 回文链表

- 题目：[234. 回文链表 - 力扣（LeetCode）](https://leetcode.cn/problems/palindrome-linked-list/description/)

- 可以先找到中间节点，然后反转前面的链表，再遍历比较

  ```cpp
  class Solution {
  public:
      ListNode* reverse(ListNode* head) {
          if (head == nullptr)
              return nullptr;
          ListNode *pre = nullptr, *cur = head;
          while (cur != nullptr) {
              ListNode* tmp = cur->next;
              cur->next = pre;
              pre = cur;
              cur = tmp;
          }
          return pre;
      }
      bool isPalindrome(ListNode* head) {
          ListNode *slow = head, *fast = head;
          if (fast == nullptr || fast->next == nullptr) {
              return true;
          }
          fast = fast->next->next;
          while (fast != nullptr && fast->next != nullptr) {
              fast = fast->next->next;
              slow = slow->next;
          }
          ListNode* mid = fast != nullptr ? slow->next->next : slow->next;
          slow->next = nullptr;
          ListNode* newHead = reverse(head);
          while (newHead != nullptr) {
              if (newHead->val != mid->val) {
                  return false;
              }
              newHead = newHead->next;
              mid = mid->next;
          }
          return true;
      }
  };
  ```

- 相关题目：[链表最大孪生和](https://leetcode.cn/problems/maximum-twin-sum-of-a-linked-list/)

### 重排链表

- 题目：[重排链表](https://leetcode.cn/problems/reorder-list/)

- 代码实现

  ```cpp
  class Solution {
  public:
      ListNode* reverse(ListNode* head) {
          if (head == nullptr)
              return nullptr;
          ListNode *pre = nullptr, *cur = head;
          while (cur != nullptr) {
              ListNode* tmp = cur->next;
              cur->next = pre;
              pre = cur;
              cur = tmp;
          }
          return pre;
      }
      void reorderList(ListNode* head) {
          ListNode *slow = head, *fast = head;
          if (fast == nullptr || fast->next == nullptr) {
              return;
          }
          fast = fast->next->next;
          while (fast != nullptr && fast->next != nullptr) {
              fast = fast->next->next;
              slow = slow->next;
          }
          ListNode* mid = slow->next;
          slow->next = nullptr;
          mid = reverse(mid);
          ListNode* pre = nullptr;
          slow = head;
          while (slow != nullptr) {
              ListNode* tmpSlow = slow->next;
              if (pre != nullptr)
                  pre->next = slow;
              slow->next = mid;
              pre = mid;
              slow = tmpSlow;
              mid = mid->next;
          }
          return;
      }
  };
  ```

### 环形链表

- 给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 null；为了表示给定链表中的环，使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环；不允许修改给定的链表

- Floyd 判圈算法
  - 用 O (1) 空间复杂度 判断一个线性数据结构（比如链表）是否存在环，并且找到环入口的经典算法

  - 整个算法分 两个阶段：
    - 阶段 1（判环）：快慢指针同时出发，若相遇则说明有环；若快指针走到末尾（nullptr）则无环；
    - 阶段 2（找环入口）：相遇后，将慢指针重置到起点，快慢指针改为同速（都走 1 步），再次相遇的节点就是环的入口

  - 为什么这样能找到入口？
    - 链表起点到环入口的距离为 `a`；
    - 环入口到相遇点的距离为 `b`；
    - 环的长度为 `c`；
    - 慢指针走的总步数：`a + b`；
    - 快指针走的总步数：`a + b + k*c`（k 是快指针绕环的圈数，因为快指针速度是 2 倍，所以 `2*(a+b) = a + b + k*c`）；
    - 化简得：`a = k*c - b` → 即 “起点到入口的距离” = “相遇点绕环回到入口的距离”
    - 因此，慢指针从起点走、快指针从相遇点同速走，必然在入口相遇

  - slow 第一次相遇时，一定只走了 `a+b`，没有绕环多圈
    - 等价于证明：slow 到达环入口后，走的步数 `b < c`（没绕完 1 圈）就会被 fast 追上

    - 步骤 1：先确定 slow 进环时，fast 和 slow 的距离范围
      - 当 slow 走完 `a` 步到达环入口时，fast 已经走了`2a`步（因为速度是 2 倍）
      - fast 的位置可以拆分为：`2a = a + m*c + d`（`m`是 fast 在环内绕的整圈数，`0 ≤ d < c`，`d`是 fast 在环内距离环入口的步数）
      - → 此时，fast 和 slow 的相对距离为：`d`（若 fast 在 slow 前方）或 `c - d`（若 fast 在 slow 后方），无论哪种情况，相对距离 < c（因为 `d < c`，`c - d < c`）
      - 简单说：slow 刚进环时，和 fast 的距离一定小于 1 圈（`c`）

    - 步骤 2：用反证法证明 “slow 不可能绕环多圈”
      - 假设：slow 第一次相遇时，绕了至少 1 圈（即 `b ≥ c`）→ 意味着：slow 进环后，走了 `≥c` 步才被 fast 追上
      - 但根据快慢指针的追赶规则：slow 进环后，每走 1 步，fast 走 2 步 → 每轮移动，fast 相对于 slow 的距离缩短 1 步（相对速度 = 2-1=1）；

      - 步骤 1 已证：slow 进环时，两者相对距离 `<c` → 追上只需要 `<c` 步；
      - 也就是说：slow 进环后走 `<c` 步就会被追上，根本走不到 `≥c` 步（绕 1 圈），这与 “假设 slow 绕了至少 1 圈” 矛盾，因此假设不成立

- 实现代码

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode(int x) : val(x), next(NULL) {}
   * };
   */
  class Solution {
  public:
      ListNode *detectCycle(ListNode *head) {
          ListNode* fast = head;
          ListNode* slow = head;
          while(fast != NULL && fast->next != NULL) {
              slow = slow->next;
              fast = fast->next->next;
              // 快慢指针相遇，此时从head 和 相遇点，同时查找直至相遇
              if (slow == fast) {
                  ListNode* index1 = fast;
                  ListNode* index2 = head;
                  while (index1 != index2) {
                      index1 = index1->next;
                      index2 = index2->next;
                  }
                  return index2; // 返回环的入口
              }
          }
          return NULL;
      }
  };
  ```

- 参考题目
  - [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/description/)
  - [142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/description/)
  - [287. 寻找重复数](https://leetcode.cn/problems/find-the-duplicate-number/description/)

### 环状数组是否存在循环

- 题目：

- 判断环形数组中是否存在一个非单元素、方向一致的循环（即环内所有元素的正负性相同，且环的长度大于 1）

- 代码实现

  ```cpp
  class Solution {
  public:
      bool circularArrayLoop(vector<int>& nums) {
          int n = nums.size(), N = n * 1000; // N是大常数，避免负数取模出错
          unordered_set<int> unvisited;
          // 初始化：所有索引都标记为未访问
          for (int i = 0; i < n; i++)
              unvisited.insert(i);

          // 遍历所有未访问的索引，逐个检测环
          while (!unvisited.empty()) {
              // 取一个未访问的起始索引，开始检测
              int start = *unvisited.begin();
              unvisited.erase(start); // 标记为已访问

              // 快慢指针初始化：都从start出发
              int slow = start, fast = start;
              while (true) {
                  // 慢指针走1步，快指针走2步
                  // +N再%n：确保结果非负（处理负数步长）
                  slow = (nums[slow] + slow + N) % n;
                  fast = (nums[fast] + fast + N) % n;
                  fast = (nums[fast] + fast + N) % n;

                  // 走过的索引标记为已访问（避免重复检测）
                  unvisited.erase(slow);
                  unvisited.erase(fast);

                  // 快慢指针相遇，说明找到环
                  if (slow == fast) {
                      // 检查环的长度是否为1：如果下一步还是自己，说明是单元素环
                      if (slow == (nums[slow] + slow + N) % n)
                          break; // 单元素环，无效，跳出循环

                      // 检查环内所有元素的方向是否一致
                      bool valid = true;
                      bool negative = nums[slow] < 0; // 记录环的方向（负/正）
                      slow = (nums[slow] + slow + N) % n; // 从下一个节点开始检查

                      // 遍历环内所有节点，验证方向
                      while (slow != fast) {
                          // 方向不一致，环无效
                          if ((nums[slow] < 0) != negative) {
                              valid = false;
                              break;
                          }
                          slow = (nums[slow] + slow + N) % n;
                      }

                      // 方向一致且环长度>1，返回true
                      if (valid)
                          return true;
                      break; // 检测完当前环，跳出
                  }
              }
          }
          // 所有索引检测完毕，无有效环
          return false;
      }
  };
  ```

- 可优化的点
  - 空间优化：`unordered_set` 占用 O (n) 空间，可改为原地标记（比如将访问过的索引对应的数值改为 `n` 的倍数，标记为已访问），将空间复杂度从 O (n) 降到 O (1)；
  - 提前终止：在方向检查时，一旦发现方向不一致，可直接跳出，无需遍历整个环；
  - N 的取值：`N = n * 1000` 可以简化为 `N = n`（因为 `(x + n) %n` 已能保证非负，无需 1000 倍）

- 代码实现

  ```cpp
  class Solution {
  public:
      bool circularArrayLoop(vector<int>& nums) {
          int n = nums.size();
          auto next = [&](int x) { return (nums[x] + x + 1000*n) % n; }; // 简化取模逻辑

          for (int i = 0; i < n; i++) {
              if (nums[i] == 0) continue; // 已访问过的节点

              int slow = i, fast = i;
              // 先检查方向是否一致（快慢指针下一步的方向）
              while (nums[slow] * nums[next(fast)] > 0 && nums[slow] * nums[next(next(fast))] > 0) {
                  slow = next(slow);
                  fast = next(next(fast));
                  if (slow == fast) {
                      // 检查环长度是否为1
                      if (slow == next(slow)) break;
                      return true;
                  }
              }

              // 标记当前路径上的所有节点为已访问（置0）
              int x = i;
              while (nums[x] * nums[next(x)] > 0) {
                  int tmp = next(x);
                  nums[x] = 0;
                  x = tmp;
              }
          }
          return false;
      }
  };
  ```

### 寻找重复数

- 题目：[寻找重复数](https://leetcode.cn/problems/find-the-duplicate-number/)

- 数组元素范围是 `[1,n]`，我们可以把数组看作一个 “隐式链表”：
  - 索引 `i` 作为链表节点；
  - 节点 `i` 的下一个节点是 `nums[i]`（即 `i → nums[i]`）

- 由于数组有且仅有一个重复数，这个隐式链表必然存在唯一的环，且环的入口就是这个重复数（因为多个索引会指向同一个入口，对应重复数）

- 代码实现

  ```cpp
  class Solution {
  public:
      int findDuplicate(vector<int>& nums) {
          int slow = 0, fast = 0;
          do {
              slow = nums[slow];
              fast = nums[nums[fast]];
          } while (slow != fast);
          slow = 0;
          while (slow != fast) {
              slow = nums[slow];
              fast = nums[fast];
          }
          return slow;
      }
  };
  ```

- 二分答案，由于数字的范围在 1-n 之间，可以直接二分答案
  - 取中间值 `mid = (left + right) / 2`
  - 统计数组中小于等于 mid 的元素个数 `count`
  - 若 `count > mid`：说明重复数在 `[left, mid]` 区间（因为正常情况下，1~mid 最多只有 mid 个不同数，count 超过 mid 说明有重复）
  - 若 `count ≤ mid`：说明重复数在 `[mid+1, right]` 区间
  - 不断缩小区间，直到 `left == right`，此时的值就是重复数
  - 这个思路的本质是利用「鸽巢原理」：如果有 `n+1` 个鸽子放进 `n` 个巢，至少有一个巢有超过 1 只鸽子

  ```cpp
  class Solution {
  public:
      int findDuplicate(vector<int>& nums) {
          int n = nums.size() - 1; // 数值范围是[1, n]
          int left = 1, right = n;

          while (left < right) {
              // 取中间值（避免溢出，等价于(left+right)/2）
              int mid = left + (right - left) / 2;
              // 统计数组中 <= mid 的元素个数
              int count = 0;
              for (int num : nums) {
                  if (num <= mid) {
                      count++;
                  }
              }

              // 鸽巢原理：count > mid 说明重复数在左区间
              if (count > mid) {
                  right = mid;
              } else {
                  // 重复数在右区间
                  left = mid + 1;
              }
          }

          // 最终left == right，就是重复数
          return left;
      }
  };
  ```

### 可被 K 整除的最小整数

- 题目：[1015. 可被 K 整除的最小整数 - 力扣（LeetCode）](https://leetcode.cn/problems/smallest-integer-divisible-by-k/description/)

- 代码实现

  ```cpp
  class Solution {
  public:
      int smallestRepunitDivByK(int k) {
          unordered_set<int> seen;
          int x = 1 % k;
          while (x && seen.insert(x).second) {
              x = (x * 10 + 1) % k;
          }
          return x ? -1 : seen.size() + 1;
      }
  };
  ```

- 除了偶数和 5 的倍数必定有解

  ```cpp
  class Solution {
  public:
      int smallestRepunitDivByK(int k) {
          if (k % 2 == 0 || k % 5 == 0) {
              return -1;
          }
          int x = 1 % k;
          for (int i = 1; ; i++) { // 一定有解
              if (x == 0) {
                  return i;
              }
              x = (x * 10 + 1) % k;
          }
      }
  };
  ```

- 相关题目
  - [3790. 最小全 1 倍数 - 力扣（LeetCode）](https://leetcode.cn/problems/smallest-all-ones-multiple/description/)

## 双指针

### 奇偶链表

- 题目：[328. 奇偶链表 - 力扣（LeetCode）](https://leetcode.cn/problems/odd-even-linked-list/description/)

- 代码实现

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* oddEvenList(ListNode* head) {
          if (head == nullptr || head->next == nullptr) {
              return head;
          }
          ListNode* dummyEven = new ListNode(0);
          ListNode *cur = head, *pre = head, *newHead = dummyEven;
          int idx = 1;
          while (cur != nullptr) {
              if (idx % 2 == 0) {
                  newHead->next = cur;
                  newHead = cur;
                  pre->next = cur->next;
                  cur->next = nullptr;
              } else {
                  pre = cur;
              }
              idx++;
              cur = pre->next;
          }
          pre->next = dummyEven->next;
          ListNode* tmp = head;
          return head;
      }
  };
  ```

### 分割链表

- 题目：[86. 分隔链表 - 力扣（LeetCode）](https://leetcode.cn/problems/partition-list/description/)

- 可以分成两个链表，然后连接在一起

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* partition(ListNode* head, int x) {
          if (head == nullptr || head->next == nullptr) {
              return head;
          }
          ListNode* dummyLess = new ListNode(0);
          ListNode* dummyGreater = new ListNode(0);
          ListNode *cur = head, *less = dummyLess, *greater = dummyGreater;
          while (cur != nullptr) {
              if (cur->val >= x) {
                  greater->next = cur;
                  greater = cur;
              } else {
                  less->next = cur;
                  less = cur;
              }
              ListNode* tmp = cur->next;
              cur->next = nullptr;
              cur = tmp;
          }
          less->next = dummyGreater->next;
          return dummyLess->next;
      }
  };
  ```

- 也可以只使用一个虚拟头节点
  - 定义一个虚拟头节点（满足 “最多一个虚拟节点” 的要求），再定义两个指针：`small` 指向小于 x 的节点链尾，`large` 指向大于等于 x 的节点链尾
  - 遍历原链表，根据节点值将节点分别挂载到 `small` 或 `large` 指针后
  - 遍历结束后，将 `small` 的尾节点指向 `large` 链的头节点，同时将 `large` 链的尾节点 `next` 置空（避免循环链表）
  - 最终返回虚拟节点的 `next` 作为新链表头

  ```cpp
  class Solution {
  public:
      ListNode* partition(ListNode* head, int x) {
          // 仅使用一个虚拟节点（满足要求），作为小于x的链表的虚拟头
          ListNode* dummy = new ListNode(0);
          ListNode* small = dummy;       // 指向小于x的链表尾
          ListNode* large = nullptr;     // 指向大于等于x的链表尾
          ListNode* largeHead = nullptr; // 记录大于等于x的链表头

          ListNode* curr = head;
          while (curr != nullptr) {
              if (curr->val < x) {
                  // 挂载到小于x的链表尾
                  small->next = curr;
                  small = small->next;
              } else {
                  // 初始化大于等于x的链表头和尾
                  if (largeHead == nullptr) {
                      largeHead = curr;
                      large = curr;
                  } else {
                      // 挂载到大于等于x的链表尾
                      large->next = curr;
                      large = large->next;
                  }
              }
              curr = curr->next; // 遍历下一个节点
          }

          // 拼接两个链表：小于x的链表尾 指向 大于等于x的链表头
          small->next = largeHead;
          // 处理大于等于x的链表尾，避免循环（最后一个节点next可能指向原链表的节点）
          if (large != nullptr) {
              large->next = nullptr;
          }

          ListNode* result = dummy->next; // 新链表的头节点
          delete dummy; // 释放虚拟节点内存，避免泄漏
          return result;
      }
  };
  ```

### 链表相交

- 给定两个单链表的头节点 headA 和 headB ，找出并返回两个单链表相交的起始节点；如果两个链表没有交点，返回 null

- 双指针法：让两个指针分别遍历两个链表，当一个指针走到末尾时，切换到另一个链表的头节点继续遍历，最终两个指针会在相交节点相遇（或同时走到 null）

  ```cpp
  #include <iostream>
  using namespace std;

  // 定义链表节点结构体
  struct ListNode {
      int val;
      ListNode *next;
      ListNode(int x) : val(x), next(NULL) {}
  };

  // 核心函数：找到两个链表相交的起始节点
  ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
      // 边界处理：任一链表为空，直接返回null
      if (headA == nullptr || headB == nullptr) {
          return nullptr;
      }

      // 初始化双指针，分别指向两个链表的头节点
      ListNode *pA = headA;
      ListNode *pB = headB;

      // 循环直到两个指针相遇（要么是相交节点，要么都是null）
      while (pA != pB) {
          // 如果pA走到末尾，切换到B的头；否则继续往后走
          pA = (pA == nullptr) ? headB : pA->next;
          // 如果pB走到末尾，切换到A的头；否则继续往后走
          pB = (pB == nullptr) ? headA : pB->next;
      }

      // 相遇时返回pA（或pB，两者相等）
      return pA;
  }
  ```

- 另一种实现时：先计算两个链表的长度，让较长链表的指针先走「长度差」步，使两个指针处于 “末尾对齐” 的位置；然后同时移动两个指针，当遇到相同节点时则返回，否则返回 null

  ```cpp
  class Solution {
  public:
      ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
          // 提前处理空链表边界
          if (headA == nullptr || headB == nullptr) {
              return nullptr;
          }

          ListNode* curA = headA;
          ListNode* curB = headB;
          int lenA = 0, lenB = 0;

          // 合并长度计算的注释，代码更紧凑
          while (curA) { lenA++; curA = curA->next; }
          while (curB) { lenB++; curB = curB->next; }

          // 重置指针
          curA = headA;
          curB = headB;

          // 直接处理长度差，避免swap（更直观）
          if (lenA > lenB) {
              for (int i = 0; i < lenA - lenB; i++) {
                  curA = curA->next;
              }
          } else {
              for (int i = 0; i < lenB - lenA; i++) {
                  curB = curB->next;
              }
          }

          // 找交点
          while (curA && curB) {
              if (curA == curB) {
                  return curA;
              }
              curA = curA->next;
              curB = curB->next;
          }

          return nullptr;
      }
  };
  ```

- 参考题目
  - [面试题 02.07. 链表相交](https://leetcode.cn/problems/intersection-of-two-linked-lists-lcci/)
  - [160. 相交链表 - 力扣（LeetCode）](https://leetcode.cn/problems/intersection-of-two-linked-lists/description/)

## 合并链表

### 两数相加

- 题目：[2. 两数相加 - 力扣（LeetCode）](https://leetcode.cn/problems/add-two-numbers/description/)

- 代码实现

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
          int carry = 0;
          ListNode *p1 = l1, *p2 = l2;
          ListNode* dummy = new ListNode(0);
          ListNode* pre = dummy;
          while (carry > 0 || p1 != nullptr || p2 != nullptr) {
              int v1 = p1 != nullptr ? p1->val : 0;
              int v2 = p2 != nullptr ? p2->val : 0;
              int sum = v1 + v2 + carry;
              carry = sum / 10;
              sum = sum % 10;
              ListNode* cur = (p1 != nullptr ? p1 : p2);
              if (cur == nullptr)
                  cur = new ListNode(sum);
              cur->val = sum;
              pre->next = cur;
              pre = cur;
              if (p1 != nullptr) {
                  ListNode* tmp = p1->next;
                  p1->next = nullptr;
                  p1 = tmp;
              }
              if (p2 != nullptr) {
                  ListNode* tmp = p2->next;
                  p2->next = nullptr;
                  p2 = tmp;
              }
          }
          return dummy->next;
      }
  };
  ```

### 两数相加 II

- 题目：[445. 两数相加 II - 力扣（LeetCode）](https://leetcode.cn/problems/add-two-numbers-ii/description/)

- 可以先反转然后相加

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* reverse(ListNode* head) {
          if (head == nullptr)
              return head;
          ListNode *cur = head, *pre = nullptr;
          while (cur != nullptr) {
              ListNode* tmp = cur->next;
              cur->next = pre;
              pre = cur;
              cur = tmp;
          }
          return pre;
      }
      ListNode* addTwoNumbersI(ListNode* l1, ListNode* l2) {
          int carry = 0;
          ListNode *p1 = l1, *p2 = l2;
          ListNode* dummy = new ListNode(0);
          ListNode* pre = dummy;
          while (carry > 0 || p1 != nullptr || p2 != nullptr) {
              int v1 = p1 != nullptr ? p1->val : 0;
              int v2 = p2 != nullptr ? p2->val : 0;
              int sum = v1 + v2 + carry;
              carry = sum / 10;
              sum = sum % 10;
              ListNode* cur = (p1 != nullptr ? p1 : p2);
              if (cur == nullptr)
                  cur = new ListNode(sum);
              cur->val = sum;
              pre->next = cur;
              pre = cur;
              if (p1 != nullptr) {
                  ListNode* tmp = p1->next;
                  p1->next = nullptr;
                  p1 = tmp;
              }
              if (p2 != nullptr) {
                  ListNode* tmp = p2->next;
                  p2->next = nullptr;
                  p2 = tmp;
              }
          }
          return dummy->next;
      }
      ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
          return reverse(addTwoNumbersI(reverse(l1), reverse(l2)));
      }
  };
  ```

- 也可以使用栈

  ```cpp
  class Solution {
  public:
      ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
          stack<int> s1, s2;
          while (l1) {
              s1.push(l1 -> val);
              l1 = l1 -> next;
          }
          while (l2) {
              s2.push(l2 -> val);
              l2 = l2 -> next;
          }
          int carry = 0;
          ListNode* ans = nullptr;
          while (!s1.empty() or !s2.empty() or carry != 0) {
              int a = s1.empty() ? 0 : s1.top();
              int b = s2.empty() ? 0 : s2.top();
              if (!s1.empty()) s1.pop();
              if (!s2.empty()) s2.pop();
              int cur = a + b + carry;
              carry = cur / 10;
              cur %= 10;
              auto curnode = new ListNode(cur);
              curnode -> next = ans;
              ans = curnode;
          }
          return ans;
      }
  };
  ```

### 翻倍以链表形式表示的数字

- 题目：[翻倍以链表形式表示的数字](https://leetcode.cn/problems/double-a-number-represented-as-a-linked-list/)

- 代码实现

  ```cpp
  class Solution {
  public:
      ListNode* reverse(ListNode* head) {
          if (head == nullptr)
              return head;
          ListNode *cur = head, *pre = nullptr;
          while (cur != nullptr) {
              ListNode* tmp = cur->next;
              cur->next = pre;
              pre = cur;
              cur = tmp;
          }
          return pre;
      }
      ListNode* doubleIt(ListNode* head) {
          ListNode* newHead = reverse(head);
          int carry = 0;
          ListNode* p1 = newHead;
          ListNode* dummy = new ListNode(0);
          ListNode* pre = dummy;
          while (carry > 0 || p1 != nullptr) {
              int val = p1 != nullptr ? p1->val : 0;
              int sum = val * 2 + carry;
              carry = sum / 10;
              sum = sum % 10;
              if (p1 == nullptr)
                  p1 = new ListNode(sum);
              p1->val = sum;
              pre->next = p1;
              pre = p1;
              ListNode* tmp = p1->next;
              p1->next = nullptr;
              p1 = tmp;
          }
          return reverse(dummy->next);
      }
  };
  ```

- 如果不考虑进位，就是每个节点的值乘以 2

- 什么时候会受到进位的影响呢？只有下一个节点大于 4 的时候，才会因为进位多加一

- 特别地，如果链表头的值大于 4，那么需要在前面插入一个新的节点

- 代码实现

  ```cpp
  class Solution {
  public:
      ListNode* doubleIt(ListNode* head) {
          if (head->val > 4) {
              head = new ListNode(0, head);
          }
          for (auto cur = head; cur; cur = cur->next) {
              cur->val = cur->val * 2 % 10;
              if (cur->next && cur->next->val > 4) {
                  cur->val++;
              }
          }
          return head;
      }
  };
  ```

### 合并两个有序链表

- 题目：

- 代码实现

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
          ListNode *p1 = list1, *p2 = list2;
          ListNode* dummy = new ListNode(0);
          ListNode* pre = dummy;
          while (p1 != nullptr && p2 != nullptr) {
              if (p1->val < p2->val) {
                  pre->next = p1;
                  pre = p1;
                  p1 = p1->next;
              } else {
                  pre->next = p2;
                  pre = p2;
                  p2 = p2->next;
              }
          }
          while (p1 != nullptr) {
              pre->next = p1;
              pre = p1;
              p1 = p1->next;
          }
          while (p2 != nullptr) {
              pre->next = p2;
              pre = p2;
              p2 = p2->next;
          }
          return dummy->next;
      }
  };
  ```

### 合并 K 个有序链表

- 题目：[23. 合并 K 个升序链表 - 力扣（LeetCode）](https://leetcode.cn/problems/merge-k-sorted-lists/description/)

- 代码实现

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
          ListNode *p1 = list1, *p2 = list2;
          ListNode* dummy = new ListNode(0);
          ListNode* pre = dummy;
          while (p1 != nullptr && p2 != nullptr) {
              if (p1->val < p2->val) {
                  pre->next = p1;
                  pre = p1;
                  p1 = p1->next;
              } else {
                  pre->next = p2;
                  pre = p2;
                  p2 = p2->next;
              }
          }
          while (p1 != nullptr) {
              pre->next = p1;
              pre = p1;
              p1 = p1->next;
          }
          while (p2 != nullptr) {
              pre->next = p2;
              pre = p2;
              p2 = p2->next;
          }
          return dummy->next;
      }
      ListNode* mergeKLists(vector<ListNode*>& lists) {
          int n = lists.size();
          std::cout << n << std::endl;
          if (n == 0)
              return nullptr;
          if (n == 1)
              return lists[0];
          if (n == 2)
              return mergeTwoLists(lists[0], lists[1]);
          vector<ListNode*> leftLists(lists.begin(), lists.begin() + n / 2 + 1);
          vector<ListNode*> rightLists(lists.begin() + n / 2 + 1, lists.end());
          ListNode* left = mergeKLists(leftLists);
          ListNode* right = mergeKLists(rightLists);
          return mergeTwoLists(left, right);
      }
  };
  ```

- 迭代写法

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
          ListNode *p1 = list1, *p2 = list2;
          ListNode* dummy = new ListNode(0);
          ListNode* pre = dummy;
          while (list1 != nullptr && list2 != nullptr) {
              if (list1->val < list2->val) {
                  pre->next = list1;
                  list1 = list1->next;
              } else {
                  pre->next = list2;
                  list2 = list2->next;
              }
              pre = pre->next;
          }
          pre->next = (list1 != nullptr) ? list1 : list2;
          ListNode* result = dummy->next;
          delete dummy;
          return result;
      }
      ListNode* mergeKLists(vector<ListNode*>& lists) {
          int n = lists.size();
          if (n == 0) return nullptr;
          for (int step = 1; step < n; step *= 2) {
              for (int i = 0; i + step < n; i += step * 2) {
                  lists[i] = mergeTwoLists(lists[i], lists[i + step]);
              }
          }
          return lists[0];
      }
  };
  ```

- 也可以使用最小堆维护当前所有链表的第一个节点的最小值

  ```cpp
  class Solution {
  public:
      ListNode* mergeKLists(vector<ListNode*>& lists) {
          auto cmp = [](const ListNode* a, const ListNode* b) {
              return a->val > b->val; // 最小堆
          };
          priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq;
          for (auto head : lists) {
              if (head) {
                  pq.push(head); // 把所有非空链表的头节点入堆
              }
          }

          ListNode dummy{}; // 哨兵节点，作为合并后链表头节点的前一个节点
          auto cur = &dummy;
          while (!pq.empty()) { // 循环直到堆为空
              auto node = pq.top(); // 剩余节点中的最小节点
              pq.pop();
              if (node->next) { // 下一个节点不为空
                  pq.push(node->next); // 下一个节点有可能是最小节点，入堆
              }
              cur->next = node; // 把 node 添加到新链表的末尾
              cur = cur->next; // 准备合并下一个节点
          }
          return dummy.next; // 哨兵节点的下一个节点就是新链表的头节点
      }
  };
  ```

- 另一种实现

  ```cpp
  class Solution {
  public:
      // 自定义比较规则：实现最小堆（优先队列默认是最大堆）
      struct CompareNode {
          bool operator()(ListNode* a, ListNode* b) {
              // 返回true表示a的优先级低于b（即b排在堆顶）
              return a->val > b->val;
          }
      };

      ListNode* mergeKLists(vector<ListNode*>& lists) {
          // 定义最小堆：存储ListNode*，比较规则为CompareNode
          priority_queue<ListNode*, vector<ListNode*>, CompareNode> minHeap;

          // 初始化堆：将每个非空链表的头节点加入堆
          for (ListNode* head : lists) {
              if (head != nullptr) {
                  minHeap.push(head);
              }
          }

          // 虚拟头节点，简化结果链表的构建
          ListNode* dummy = new ListNode(0);
          ListNode* curr = dummy;

          // 循环取堆顶的最小节点，构建结果链表
          while (!minHeap.empty()) {
              // 取出堆顶的最小节点
              ListNode* minNode = minHeap.top();
              minHeap.pop();

              // 将最小节点接入结果链表
              curr->next = minNode;
              curr = curr->next;

              // 如果该节点有下一个节点，加入堆中
              if (minNode->next != nullptr) {
                  minHeap.push(minNode->next);
              }
          }

          // 保存结果头节点，释放虚拟节点
          ListNode* result = dummy->next;
          delete dummy;
          return result;
      }
  };
  ```

### 排序链表

- 题目：[148. 排序链表 - 力扣（LeetCode）](https://leetcode.cn/problems/sort-list/description/)

- 代码实现——归并排序

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
          ListNode *p1 = list1, *p2 = list2;
          ListNode* dummy = new ListNode(0);
          ListNode* pre = dummy;
          while (list1 != nullptr && list2 != nullptr) {
              if (list1->val < list2->val) {
                  pre->next = list1;
                  list1 = list1->next;
              } else {
                  pre->next = list2;
                  list2 = list2->next;
              }
              pre = pre->next;
          }
          pre->next = (list1 != nullptr) ? list1 : list2;
          ListNode* result = dummy->next;
          delete dummy;
          return result;
      }
      ListNode* sortList(ListNode* head) {
          if (head == nullptr || head->next == nullptr)
              return head;
          ListNode *slow = head, *fast = head;
          fast = fast->next->next;
          while (fast != nullptr && fast->next != nullptr) {
              slow = slow->next;
              fast = fast->next->next;
          }
          ListNode* right = slow->next;
          slow->next = nullptr;
          ListNode* left = head;
          left = sortList(left);
          right = sortList(right);
          return mergeTwoLists(left, right);
      }
  };
  ```

- 迭代实现
  - 计算链表长度：先遍历链表得到总长度，用于控制合并的步长和次数；
  - 自下而上合并：
    - 初始步长 `step = 1`（先合并相邻的 2 个长度为 1 的子链表）；
    - 每次将链表按当前步长拆分为若干子链表，两两合并，合并后用虚拟头节点衔接；
    - 步长翻倍（`step *= 2`），重复合并过程，直到步长超过链表总长度；
  - 边界处理：每次合并时处理剩余不足步长的子链表，保证不遗漏节点

  ```cpp
  class Solution {
  public:
      ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
          ListNode* dummy = new ListNode(0);
          ListNode* pre = dummy;
          while (list1 != nullptr && list2 != nullptr) {
              if (list1->val < list2->val) {
                  pre->next = list1;
                  list1 = list1->next;
              } else {
                  pre->next = list2;
                  list2 = list2->next;
              }
              pre = pre->next;
          }
          pre->next = (list1 != nullptr) ? list1 : list2;
          ListNode* result = dummy->next;
          delete dummy;
          return result;
      }

      // 迭代版链表归并排序（自下而上）
      ListNode* sortList(ListNode* head) {
          if (head == nullptr || head->next == nullptr) {
              return head;
          }

          // 第一步：计算链表总长度
          int len = 0;
          ListNode* curr = head;
          while (curr != nullptr) {
              len++;
              curr = curr->next;
          }

          // 虚拟头节点：用于衔接每次合并后的链表
          ListNode* dummy = new ListNode(0);
          dummy->next = head;

          // 第二步：自下而上合并，步长从1开始，每次翻倍
          for (int step = 1; step < len; step *= 2) {
              ListNode* prev = dummy; // 上一次合并后的尾节点
              curr = dummy->next;     // 当前待合并的起始节点

              while (curr != nullptr) {
                  // 1. 找到第一个待合并的子链表（长度为step）
                  ListNode* left = curr;
                  for (int i = 1; i < step && curr->next != nullptr; i++) {
                      curr = curr->next;
                  }

                  // 2. 找到第二个待合并的子链表（长度为step）
                  ListNode* right = curr->next;
                  curr->next = nullptr; // 切断left和right的连接
                  curr = right;
                  for (int i = 1; i < step && curr != nullptr && curr->next != nullptr; i++) {
                      curr = curr->next;
                  }

                  // 3. 保存下一次合并的起始节点，并切断right的后续连接
                  ListNode* next = nullptr;
                  if (curr != nullptr) {
                      next = curr->next;
                      curr->next = nullptr;
                  }

                  // 4. 合并left和right两个子链表，接入结果
                  ListNode* merged = mergeTwoLists(left, right);
                  prev->next = merged;

                  // 5. 将prev移动到合并后的链表尾部，准备下一次合并
                  while (prev->next != nullptr) {
                      prev = prev->next;
                  }

                  // 6. 处理下一组待合并的节点
                  curr = next;
              }
          }

          // 保存结果并释放虚拟节点
          ListNode* result = dummy->next;
          delete dummy;
          return result;
      }
  };
  ```

- 快速排序

  ```cpp
  class Solution {
  public:
      ListNode* sortList(ListNode* head) {
          // 递归终止条件：空链表或单个节点
          if (head == nullptr || head->next == nullptr) return head;

          // 分区：小于基准、等于基准、大于基准
          ListNode* dummySmall = new ListNode(0); // 小于基准的链表
          ListNode* dummyEqual = new ListNode(0); // 等于基准的链表
          ListNode* dummyLarge = new ListNode(0); // 大于基准的链表
          ListNode *pSmall = dummySmall, *pEqual = dummyEqual, *pLarge = dummyLarge;

          int pivot = head->val; // 选头节点作为基准
          ListNode* curr = head;
          while (curr != nullptr) {
              if (curr->val < pivot) {
                  pSmall->next = curr;
                  pSmall = pSmall->next;
              } else if (curr->val == pivot) {
                  pEqual->next = curr;
                  pEqual = pEqual->next;
              } else {
                  pLarge->next = curr;
                  pLarge = pLarge->next;
              }
              curr = curr->next;
          }

          // 切断尾节点，避免循环
          pSmall->next = nullptr;
          pEqual->next = nullptr;
          pLarge->next = nullptr;

          // 递归排序小于和大于基准的链表
          ListNode* sortedSmall = sortList(dummySmall->next);
          ListNode* sortedLarge = sortList(dummyLarge->next);

          // 拼接三个链表
          ListNode* result = dummyEqual->next;
          // 拼接小于基准的部分
          if (sortedSmall != nullptr) {
              ListNode* temp = sortedSmall;
              while (temp->next != nullptr) temp = temp->next;
              temp->next = result;
              result = sortedSmall;
          }
          // 拼接大于基准的部分
          pEqual->next = sortedLarge;

          // 释放虚拟节点
          delete dummySmall;
          delete dummyEqual;
          delete dummyLarge;

          return result;
      }
  };
  ```

## 综合应用

### 链表中的下一个更大节点

- 题目：[1019. 链表中的下一个更大节点 - 力扣（LeetCode）](https://leetcode.cn/problems/next-greater-node-in-linked-list/description/)

- 使用单调栈解决

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      vector<int> nextLargerNodes(ListNode* head) {
          vector<int> vec;
          vector<int> res;
          ListNode* cur = head;
          stack<int> st;
          while (cur != nullptr) {
              int x = cur->val;
              while (!st.empty() && vec[st.top()] < x) {
                  int t = st.top();
                  st.pop();
                  res[t] = x;
              }
              vec.push_back(x);
              res.push_back(0);
              st.push(vec.size() - 1);
              cur = cur->next;
          }
          return res;
      }
  };
  ```

### 从链表中删去总和值为零的连续节点

- 题目：[从链表中删去总和值为零的连续节点](https://leetcode.cn/problems/remove-zero-sum-consecutive-nodes-from-linked-list/)

- 可以先转为数组，删去数组中总和为 0 的子数组，然后转为链表

  ```cpp
  /**
   * Definition for singly-linked list.
   * struct ListNode {
   *     int val;
   *     ListNode *next;
   *     ListNode() : val(0), next(nullptr) {}
   *     ListNode(int x) : val(x), next(nullptr) {}
   *     ListNode(int x, ListNode *next) : val(x), next(next) {}
   * };
   */
  class Solution {
  public:
      ListNode* removeZeroSumSublists(ListNode* head) {
          vector<int> nums;
          ListNode* cur = head;
          while (cur != nullptr) {
              nums.push_back(cur->val);
              cur = cur->next;
          }
          while (true) {
              int n = nums.size();
              int k = 0;
              int cur_sum = 0;
              unordered_map<int, int> cnt;
              cnt[0] = -1;
              for (int i = 0; i < n; i++) {
                  cur_sum += nums[i];
                  if (cnt.contains(cur_sum)) {
                      nums.erase(nums.begin() + cnt[cur_sum] + 1,
                                 nums.begin() + i + 1);
                      break;
                  }
                  cnt[cur_sum] = i;
              }
              if (nums.size() == n)
                  break;
          }
          if (nums.size() == 0)
              return nullptr;
          cur = head;
          for (int n = nums.size(), i = 0; i < n; i++) {
              cur->val = nums[i];
              if (i < n - 1)
                  cur = cur->next;
          }
          if (cur != nullptr)
              cur->next = nullptr;
          return head;
      }
  };
  ```

- 当然也可以直接在原链表上操作
  - 前缀和思想：遍历链表时计算前缀和（从链表头到当前节点的累加和），如果两个节点的前缀和相等，说明这两个节点之间的连续节点和为 0
  - 哈希表记录：用哈希表存储 “前缀和 -> 对应节点”，首次出现的前缀和记录节点位置，后续遇到相同前缀和时，直接删除这两个节点之间的所有节点
  - 虚拟头节点：处理链表头节点可能被删除的情况（如链表头到某节点和为 0）
  - 反复删除的处理：前缀和的特性天然支持 “一次性处理所有和为 0 的连续区间”，无需多次遍历（因为哈希表会覆盖后续重复的前缀和，直接定位最长的和为 0 区间）

- 代码实现

  ```cpp
  class Solution {
  public:
      ListNode* removeZeroSumSublists(ListNode* head) {
          // 虚拟头节点，处理头节点被删除的情况
          ListNode* dummy = new ListNode(0);
          dummy->next = head;

          unordered_map<int, ListNode*> prefixSumMap;
          int prefixSum = 0;
          ListNode* curr = dummy;

          // 第一次遍历：存储每个前缀和最后一次出现的节点（覆盖旧记录）
          while (curr != nullptr) {
              prefixSum += curr->val;
              // 关键：直接覆盖，保留最后一次出现的节点
              prefixSumMap[prefixSum] = curr;
              curr = curr->next;
          }

          // 第二次遍历：删除所有和为0的连续区间
          prefixSum = 0;
          curr = dummy;
          while (curr != nullptr) {
              prefixSum += curr->val;
              // 当前节点直接指向该前缀和最后一次出现的节点的下一个位置
              // 中间的所有节点（和为0）被直接跳过（删除）
              curr->next = prefixSumMap[prefixSum]->next;
              curr = curr->next;
          }

          ListNode* result = dummy->next;
          delete dummy; // 释放虚拟节点
          return result;
      }
  };
  ```

- 也可以一次遍历
  - 虚拟头节点：处理头节点可能被删除的边界情况，同时作为前缀和`0`的初始节点；
  - 动态哈希表：存储「前缀和 → 对应节点」，但不是单纯覆盖，而是：
    - 遇到新的前缀和：直接存入哈希表；
    - 遇到重复的前缀和：
      - 先删除哈希表中“旧前缀和节点的下一个节点”到“当前节点”之间的所有前缀和记录（这些节点即将被删除，记录无意义）；
      - 再将旧前缀和节点的`next`指向当前节点的`next`（删除和为0的区间）；
      - 无需更新哈希表中该前缀和的记录（因为后续遍历会基于最新的链表继续）；
  - 一次遍历到底：遍历过程中实时处理所有和为0的区间，无需二次遍历

- 代码实现

  ```cpp
  class Solution {
  public:
      ListNode* removeZeroSumSublists(ListNode* head) {
          // 虚拟头节点，前缀和初始为0对应虚拟头
          ListNode* dummy = new ListNode(0);
          dummy->next = head;

          unordered_map<int, ListNode*> prefixSumMap;
          int prefixSum = 0;
          ListNode* curr = dummy;

          // 仅一次遍历：实时处理和为0的区间
          while (curr != nullptr) {
              prefixSum += curr->val;

              // 情况1：当前前缀和已存在 → 中间区间和为0，需要删除
              if (prefixSumMap.count(prefixSum)) {
                  // 1. 找到旧的前缀和节点（区间起点的前一个节点）
                  ListNode* prevNode = prefixSumMap[prefixSum];
                  // 2. 临时节点：遍历要删除的区间，清理哈希表中的无效记录
                  ListNode* temp = prevNode->next;
                  int tempSum = prefixSum;

                  // 3. 清理哈希表中「旧节点下一个」到「当前节点」的前缀和记录
                  while (temp != curr) {
                      tempSum += temp->val;
                      prefixSumMap.erase(tempSum); // 无效记录删除
                      temp = temp->next;
                  }

                  // 4. 删除链表中的和为0区间（核心操作）
                  prevNode->next = curr->next;
              }
              // 情况2：当前前缀和首次出现 → 存入哈希表
              else {
                  prefixSumMap[prefixSum] = curr;
              }

              // 继续遍历下一个节点（注意：删除区间后，curr指向的是被删区间的最后一个节点，
              // 但prevNode->next已指向curr->next，因此curr直接走next即可）
              curr = curr->next;
          }

          ListNode* result = dummy->next;
          delete dummy; // 释放虚拟节点
          return result;
      }
  };
  ```

- 如果是和为 K 呢？

  ```cpp
  class Solution {
  public:
      ListNode* removeSumKSublists(ListNode* head, int K) {
          // 虚拟头节点：处理头节点被删除的边界，且前缀和初始为0对应虚拟头
          ListNode* dummy = new ListNode(0);
          dummy->next = head;

          unordered_map<int, ListNode*> prefixSumMap;
          int prefixSum = 0;
          ListNode* curr = dummy;

          // 一次遍历：动态维护前缀和，实时删除和为K的连续区间
          while (curr != nullptr) {
              prefixSum += curr->val;

              // 核心判断：是否存在前缀和 = 当前前缀和 - K（则中间区间和为K）
              int targetSum = prefixSum - K;
              if (prefixSumMap.count(targetSum)) {
                  // 1. 找到目标前缀和对应的节点（区间起点的前一个节点）
                  ListNode* prevNode = prefixSumMap[targetSum];
                  // 2. 临时节点：清理哈希表中待删除区间的无效前缀和记录
                  ListNode* temp = prevNode->next;
                  int tempSum = prefixSumMap[targetSum]->val + temp->val; // 从区间第一个节点开始算

                  // 3. 清理哈希表中「prevNode下一个」到「curr」的前缀和记录
                  while (temp != curr) {
                      prefixSumMap.erase(tempSum); // 删除无效记录
                      temp = temp->next;
                      if (temp != nullptr) {
                          tempSum += temp->val;
                      }
                  }

                  // 4. 删除链表中「prevNode下一个」到「curr」的节点（和为K的区间）
                  prevNode->next = curr->next;
              }
              // 若目标前缀和不存在，且当前前缀和未记录 → 存入哈希表
              else if (!prefixSumMap.count(prefixSum)) {
                  prefixSumMap[prefixSum] = curr;
              }

              // 继续遍历下一个节点
              curr = curr->next;
          }

          ListNode* result = dummy->next;
          delete dummy; // 释放虚拟节点
          return result;
      }
  };
  ```

- 两次遍历法

  ```cpp
  class Solution {
  public:
      ListNode* removeSumKSublists(ListNode* head, int K) {
          // 虚拟头节点：处理头节点被删除的边界，前缀和初始为0对应虚拟头
          ListNode* dummy = new ListNode(0);
          dummy->next = head;

          unordered_map<int, ListNode*> prefixSumMap;
          int prefixSum = 0;
          ListNode* curr = dummy;

          // 第一次遍历：存储每个前缀和最后一次出现的节点（覆盖旧记录）
          while (curr != nullptr) {
              prefixSum += curr->val;
              // 关键：直接覆盖，保留最后一次出现的节点（最长和为K的区间）
              prefixSumMap[prefixSum] = curr;
              curr = curr->next;
          }

          // 第二次遍历：删除所有和为K的连续区间
          prefixSum = 0;
          curr = dummy;
          while (curr != nullptr) {
              prefixSum += curr->val;
              // 核心判断：查找是否存在前缀和 = 当前前缀和 - K
              int targetSum = prefixSum - K;
              if (prefixSumMap.find(targetSum) != prefixSumMap.end()) {
                  // 删除区间：当前节点指向目标前缀和节点的下一个位置
                  curr->next = prefixSumMap[targetSum]->next;
              }
              // 无论是否删除，都继续遍历下一个节点
              curr = curr->next;
          }

          ListNode* result = dummy->next;
          delete dummy; // 释放虚拟节点
          return result;
      }
  };
  ```

### 设计链表

- 题目：[707. 设计链表 - 力扣（LeetCode）](https://leetcode.cn/problems/design-linked-list/)

- 代码实现

  ```cpp
  class MyLinkedList {
  public:
      ListNode* dummy;
      MyLinkedList() { dummy = new ListNode(0); }

      int get(int index) {
          ListNode* cur = dummy;
          while (cur != nullptr && index >= 0) {
              cur = cur->next;
              index--;
          }
          return cur != nullptr ? cur->val : -1;
      }

      void addAtHead(int val) {
          ListNode* tmp = new ListNode(val, dummy->next);
          dummy->next = tmp;
      }

      void addAtTail(int val) {
          ListNode* tmp = new ListNode(val);
          ListNode* cur = dummy;
          while (cur->next != nullptr) {
              cur = cur->next;
          }
          cur->next = tmp;
      }

      void addAtIndex(int index, int val) {
          ListNode* tmp = new ListNode(val);
          ListNode* cur = dummy;
          while (cur != nullptr && index > 0) {
              cur = cur->next;
              index--;
          }
          if (cur == nullptr)
              return;
          tmp->next = cur->next;
          cur->next = tmp;
      }

      void deleteAtIndex(int index) {
          ListNode* cur = dummy;
          while (cur != nullptr && index > 0) {
              cur = cur->next;
              index--;
          }
          if (cur == nullptr || cur->next == nullptr)
              return;
          ListNode* tmp = cur->next;
          cur->next = tmp->next;
          delete tmp;
      }
  };

  /**
   * Your MyLinkedList object will be instantiated and called as such:
   * MyLinkedList* obj = new MyLinkedList();
   * int param_1 = obj->get(index);
   * obj->addAtHead(val);
   * obj->addAtTail(val);
   * obj->addAtIndex(index,val);
   * obj->deleteAtIndex(index);
   */
  ```

### LRU 缓存

- 题目：[146. LRU 缓存 - 力扣（LeetCode）](https://leetcode.cn/problems/lru-cache/description/)

- 核心要求
  - O(1) 时间内判断某个 key 是否存在，并返回其值
  - O(1) 时间内删除需要被逐出缓存的节点
  - O(1) 时间内将最近被访问的节点移动至链表结尾（O(1) 时间内获取被访问 key 对应的节点）

- 数据结构设计
  - 为了获取某个 key 对应的节点，设计一个哈希表，键为 key，值为结点指针
  - 为了快速将一个节点移动至链表结尾，使用双向链表，以能够将某个节点摘除，并挪动至链表末尾

- 核心函数设计
  - addToTail：将某个节点插入到末尾
  - pickNode：将某个节点从链表中摘除
  - checkCapacity：检查是否超过容量大小，将最久未使用的节点从链表中逐出

- 代码实现

  ```cpp
  struct DListNode {
      int key;
      int val;
      DListNode* pre;
      DListNode* next;
      DListNode(int _key, int _val) : key(_key), val(_val) {}
  };
  class LRUCache {
  public:
      DListNode* dummy;
      int capacity = 0;
      unordered_map<int, DListNode*> umap;
      LRUCache(int _capacity) {
          capacity = _capacity;
          dummy = new DListNode(0, 0);
          dummy->next = dummy;
          dummy->pre = dummy;
      }

      void addToTail(DListNode* node) {
          DListNode* tail = dummy->pre;
          node->pre = tail;
          node->next = tail->next;
          tail->next->pre = node;
          tail->next = node;
      }

      void pickNode(DListNode* node) {
          node->pre->next = node->next;
          node->next->pre = node->pre;
          node->next = nullptr;
          node->pre = nullptr;
      }

      void checkCapacity() {
          while (umap.size() > capacity) {
              DListNode* tmp = dummy->next;
              tmp->next->pre = dummy;
              dummy->next = tmp->next;
              umap.erase(tmp->key);
              delete tmp;
          }
      }

      int get(int key) {
          if (umap.contains(key)) {
              DListNode* node = umap[key];
              pickNode(node);
              addToTail(node);
              return node->val;
          }
          return -1;
      }

      void put(int key, int value) {
          if (umap.contains(key)) {
              DListNode* node = umap[key];
              node->val = value;
              pickNode(node);
              addToTail(node);
          } else {
              DListNode* node = new DListNode(key, value);
              addToTail(node);
              umap[key] = node;
          }
          checkCapacity();
      }

      void print() {
          DListNode* cur = dummy->next;
          while (cur != dummy) {
              std::cout << cur->key << " ";
              cur = cur->next;
          }
          std::cout << std::endl;
      }
  };

  /**
   * Your LRUCache object will be instantiated and called as such:
   * LRUCache* obj = new LRUCache(capacity);
   * int param_1 = obj->get(key);
   * obj->put(key,value);
   */
  ```

### LFU 缓存

- 题目：[460. LFU 缓存 - 力扣（LeetCode）](https://leetcode.cn/problems/lfu-cache/)

- 与 LRU 缓存相比，LFU 应该为每种使用次数维护一个 LRU 缓存

- 数据结构设计
  - 为了获取某个 key 对应的节点，设计一个哈希表，键为 key，值为结点指针
  - 为了快速将一个节点移动至链表结尾，使用双向链表，以能够将某个节点摘除，并挪动至链表末尾
  - 设计一个哈希表，键为使用次数，值为对应的 LRU 链表
  - 设计一个哈希表，键为 key，值为使用次数

- 核心函数设计
  - addToTail：将某个节点插入到末尾
  - pickNode：将某个节点从链表中摘除
  - checkCapacity：检查是否超过容量大小，将最少使用的最久未使用的节点从链表中逐出

- 代码实现

  ```cpp
  struct DListNode {
      int key;
      int val;
      DListNode* pre;
      DListNode* next;
      DListNode(int _key, int _val) : key(_key), val(_val) {}
  };
  class LFUCache {
  public:
      int capacity = 0;
      unordered_map<int, int> cnt;
      unordered_map<int, DListNode*> umap;
      unordered_map<int, DListNode*> dummyMap;
      LFUCache(int _capacity) { capacity = _capacity; }

      DListNode* getDummy(int frequency) {
          if (dummyMap.contains(frequency)) {
              return dummyMap[frequency];
          } else {
              DListNode* dummy = new DListNode(0, 0);
              dummy->next = dummy;
              dummy->pre = dummy;
              dummyMap[frequency] = dummy;
              return dummy;
          }
      }

      void addToTail(DListNode* dummy, DListNode* node) {
          DListNode* tail = dummy->pre;
          node->pre = tail;
          node->next = tail->next;
          tail->next->pre = node;
          tail->next = node;
      }

      void pickNode(DListNode* node) {
          node->pre->next = node->next;
          node->next->pre = node->pre;
          node->next = nullptr;
          node->pre = nullptr;
      }

      void removeOld() {
          if (umap.size() == capacity) {
              int i = 1;
              while (i) {
                  if (dummyMap.contains(i)) {
                      DListNode* dummy = getDummy(i);
                      DListNode* tmp = dummy->next;
                      tmp->next->pre = dummy;
                      dummy->next = tmp->next;
                      umap.erase(tmp->key);
                      cnt.erase(tmp->key);
                      delete tmp;
                      cleanFrequency(i);
                      break;
                  }
                  i++;
              }
          }
      }

      void cleanFrequency(int frequency) {
          DListNode* dummy = getDummy(frequency);
          if (dummy->next == dummy) {
              dummyMap.erase(frequency);
              delete dummy;
          }
      }

      int get(int key) {
          if (umap.contains(key)) {
              DListNode* node = umap[key];
              DListNode* dummy = getDummy(cnt[key] + 1);
              pickNode(node);
              addToTail(dummy, node);
              cleanFrequency(cnt[key]);
              cnt[key]++;
              return node->val;
          }
          return -1;
      }

      void put(int key, int value) {
          if (umap.contains(key)) {
              DListNode* node = umap[key];
              DListNode* dummy = getDummy(cnt[key] + 1);
              node->val = value;
              pickNode(node);
              addToTail(dummy, node);
              cleanFrequency(cnt[key]);
              cnt[key]++;
          } else {
              DListNode* node = new DListNode(key, value);
              removeOld();
              DListNode* dummy = getDummy(1);
              addToTail(dummy, node);
              umap[key] = node;
              cnt[key] = 1;
          }
      }

      void print() {
          for (auto& pair : dummyMap) {
              std::cout << pair.first << " : ";
              DListNode* dummy = pair.second;
              DListNode* cur = dummy->next;
              while (cur != dummy) {
                  std::cout << cur->key << " ";
                  cur = cur->next;
              }
              std::cout << std::endl;
          }
          std::cout << "==================" << std::endl;
      }
  };

  /**
   * Your LFUCache object will be instantiated and called as such:
   * LFUCache* obj = new LFUCache(capacity);
   * int param_1 = obj->get(key);
   * obj->put(key,value);
   */
  ```

### 全为 O(1) 的数据结构

- 题目：[432. 全 O(1) 的数据结构 - 力扣（LeetCode）](https://leetcode.cn/problems/all-oone-data-structure/description/)

- 代码实现

  ```cpp
  struct DListNode {
      string key;
      DListNode* pre;
      DListNode* next;
      DListNode(string _key) : key(_key), pre(nullptr), next(nullptr) {}
  };

  class AllOne {
  public:
      unordered_map<string, int> cnt;          // key -> 频率
      unordered_map<string, DListNode*> umap;  // key -> 节点指针
      unordered_map<int, DListNode*> dummyMap; // 频率 -> 链表哑节点
      int minFreq;                             // 维护当前最小频率
      int maxFreq;                             // 维护当前最大频率

      AllOne() : minFreq(0), maxFreq(0) {}

      // 获取指定频率的哑节点（不存在则创建）
      DListNode* getDummy(int frequency) {
          if (dummyMap.find(frequency) != dummyMap.end()) {
              return dummyMap[frequency];
          } else {
              DListNode* dummy = new DListNode("");
              dummy->next = dummy;
              dummy->pre = dummy;
              dummyMap[frequency] = dummy;
              return dummy;
          }
      }

      // 将节点添加到链表尾部
      void addToTail(DListNode* dummy, DListNode* node) {
          DListNode* tail = dummy->pre;
          node->pre = tail;
          node->next = dummy;
          tail->next = node;
          dummy->pre = node;
      }

      // 从链表中移除节点
      void pickNode(DListNode* node) {
          if (node->pre && node->next) { // 避免空指针
              node->pre->next = node->next;
              node->next->pre = node->pre;
              node->pre = nullptr;
              node->next = nullptr;
          }
      }

      // 清理空的频率链表
      void cleanFrequency(int frequency) {
          auto it = dummyMap.find(frequency);
          if (it == dummyMap.end())
              return;

          DListNode* dummy = it->second;
          if (dummy->next == dummy) {
              dummyMap.erase(it);
              delete dummy;
          }
      }

      // 查找当前最小频率（仅在minFreq失效时调用）
      int findMinFreq() {
          int minF = INT_MAX;
          for (auto& pair : dummyMap) {
              if (pair.first < minF)
                  minF = pair.first;
          }
          return minF;
      }

      // 查找当前最大频率（仅在maxFreq失效时调用）
      int findMaxFreq() {
          int maxF = INT_MIN;
          for (auto& pair : dummyMap) {
              if (pair.first > maxF)
                  maxF = pair.first;
          }
          return maxF;
      }

      void inc(string key) {
          if (umap.find(key) != umap.end()) {
              // 1. 已有key：更新频率
              DListNode* node = umap[key];
              int oldFreq = cnt[key];
              pickNode(node);
              cleanFrequency(oldFreq);

              // 2. 频率+1
              int newFreq = oldFreq + 1;
              cnt[key] = newFreq;
              DListNode* dummy = getDummy(newFreq);
              addToTail(dummy, node);

              // 3. 更新maxFreq/minFreq
              if (newFreq > maxFreq)
                  maxFreq = newFreq;
              if (oldFreq == minFreq && !dummyMap.contains(oldFreq)) {
                  minFreq = newFreq; // 旧最小频率链表已空，新最小是newFreq
              }
          } else {
              // 1. 新key：频率设为1
              DListNode* node = new DListNode(key);
              DListNode* dummy = getDummy(1);
              addToTail(dummy, node);
              umap[key] = node;
              cnt[key] = 1;

              // 2. 更新maxFreq/minFreq
              minFreq = 1; // 新key的频率是1，必然是最小
              if (maxFreq < 1)
                  maxFreq = 1;
          }
      }

      void dec(string key) {
          if (umap.find(key) == umap.end())
              return;

          DListNode* node = umap[key];
          int oldFreq = cnt[key];
          pickNode(node);
          cleanFrequency(oldFreq);

          int newFreq = oldFreq - 1;
          if (newFreq > 0) {
              // 1. 频率>0：保留节点，添加到新频率链表
              cnt[key] = newFreq;
              DListNode* dummy = getDummy(newFreq);
              addToTail(dummy, node);

              // 2. 更新minFreq/maxFreq
              if (newFreq < minFreq)
                  minFreq = newFreq;
              if (oldFreq == maxFreq && !dummyMap.contains(oldFreq)) {
                  maxFreq = newFreq; // 旧最大频率链表已空，新最大是newFreq
              }
          } else {
              // 2. 频率=0：删除节点
              umap.erase(key);
              cnt.erase(key);
              delete node;

              // 更新maxFreq/minFreq（频率链表可能为空）
              if (oldFreq == maxFreq && !dummyMap.contains(oldFreq)) {
                  maxFreq = dummyMap.empty() ? 0 : findMaxFreq();
              }
              if (oldFreq == minFreq && !dummyMap.contains(oldFreq)) {
                  minFreq = dummyMap.empty() ? 0 : findMinFreq();
              }
          }
      }

      string getMaxKey() {
          if (dummyMap.empty())
              return ""; // 空缓存返回空字符串

          // 找到最大频率的链表，取第一个有效节点的key
          DListNode* dummy = getDummy(maxFreq);
          if (dummy->next == dummy) {
              // 极端情况：maxFreq失效，重新查找
              maxFreq = findMaxFreq();
              dummy = getDummy(maxFreq);
          }
          return dummy->next->key;
      }

      string getMinKey() {
          if (dummyMap.empty())
              return ""; // 空缓存返回空字符串

          // 找到最小频率的链表，取第一个有效节点的key
          DListNode* dummy = getDummy(minFreq);
          if (dummy->next == dummy) {
              // 极端情况：minFreq失效，重新查找
              minFreq = findMinFreq();
              dummy = getDummy(minFreq);
          }
          return dummy->next->key;
      }

      // 析构函数：释放内存（可选，避免内存泄漏）
      ~AllOne() {
          for (auto& pair : dummyMap) {
              DListNode* dummy = pair.second;
              DListNode* cur = dummy->next;
              while (cur != dummy) {
                  DListNode* tmp = cur;
                  cur = cur->next;
                  delete tmp;
              }
              delete dummy;
          }
          umap.clear();
          cnt.clear();
          dummyMap.clear();
      }
  };
  ```

- 实际上，由于同一次数的字符串不需要维护先后顺序，使用一个节点表示一种次数的所有字符串即可
  - 每个节点不再存单个 key，而是存「频率值 + 该频率下的所有 key（用哈希集合） + 双向链表指针」
  - 全局双向链表结构
    - 链表头：频率最小的桶
    - 链表尾：频率最大的桶
    - 只有一个 dummy 节点，`dummy->next` 是频率最小的桶，`dummy->prev` 是频率最大的桶
  - 哈希表映射
    - `key2freq`：key → 对应频率（快速查 key 的频率）
    - `freq2bucket`：频率 → 对应桶节点（快速定位桶）
  - 操作逻辑
    - `inc(key)`：找到 key 的桶 → 移除 key → 检查「频率 + 1」的桶是否存在 → 不存在则创建并插入当前桶后 → 将 key 加入新桶 → 原桶空则删除；
    - `dec(key)`：逻辑对称，找到 key 的桶 → 移除 key → 检查「频率 - 1」的桶是否存在 → 不存在则创建并插入当前桶前 → 将 key 加入新桶 → 原桶空则删除；
    - `getMaxKey`：直接取链表尾的前一个节点（真实尾桶）的任意 key；
    - `getMinKey`：直接取链表头的后一个节点（真实头桶）的任意 key

- 代码实现

  ```cpp
  // 频率桶：存储同一频率的所有key
  struct Bucket {
      int freq;
      unordered_set<string> keys;
      Bucket* prev;
      Bucket* next;
      Bucket(int f) : freq(f), prev(nullptr), next(nullptr) {}
  };

  class AllOne {
  private:
      Bucket* dummy; // 唯一的哑节点，循环链表的核心
      unordered_map<string, int> key2freq;    // key -> 频率
      unordered_map<int, Bucket*> freq2bucket;// 频率 -> 对应桶

      // 辅助函数：在prevBucket之后插入newBucket（循环链表）
      void insertAfter(Bucket* prevBucket, Bucket* newBucket) {
          newBucket->prev = prevBucket;
          newBucket->next = prevBucket->next;
          prevBucket->next->prev = newBucket;
          prevBucket->next = newBucket;
      }

      // 辅助函数：从循环链表中删除指定桶
      void removeBucket(Bucket* bucket) {
          bucket->prev->next = bucket->next;
          bucket->next->prev = bucket->prev;
          freq2bucket.erase(bucket->freq);
          delete bucket;
      }

  public:
      AllOne() {
          // 初始化唯一的dummy节点，形成自循环
          dummy = new Bucket(0);
          dummy->prev = dummy;
          dummy->next = dummy;
      }

      void inc(string key) {
          if (key2freq.find(key) != key2freq.end()) {
              // 1. key已存在：获取旧频率和旧桶
              int oldFreq = key2freq[key];
              Bucket* oldBucket = freq2bucket[oldFreq];

              // 2. 从旧桶移除key
              oldBucket->keys.erase(key);

              // 3. 处理新频率（oldFreq+1）
              int newFreq = oldFreq + 1;
              if (freq2bucket.find(newFreq) == freq2bucket.end()) {
                  // 新频率桶不存在：插入旧桶后面（保持频率递增）
                  Bucket* newBucket = new Bucket(newFreq);
                  insertAfter(oldBucket, newBucket);
                  freq2bucket[newFreq] = newBucket;
              }
              // 将key加入新频率桶
              freq2bucket[newFreq]->keys.insert(key);
              key2freq[key] = newFreq;

              // 4. 旧桶空则删除
              if (oldBucket->keys.empty()) {
                  removeBucket(oldBucket);
              }
          } else {
              // 1. 新key：频率设为1
              key2freq[key] = 1;

              // 2. 检查频率1的桶是否存在
              if (freq2bucket.find(1) == freq2bucket.end()) {
                  // 不存在：插入dummy后面（频率最小的位置）
                  Bucket* newBucket = new Bucket(1);
                  insertAfter(dummy, newBucket);
                  freq2bucket[1] = newBucket;
              }
              // 将key加入频率1的桶
              freq2bucket[1]->keys.insert(key);
          }
      }

      void dec(string key) {
          if (key2freq.find(key) == key2freq.end()) {
              return; // key不存在，直接返回
          }

          // 1. 获取旧频率和旧桶
          int oldFreq = key2freq[key];
          Bucket* oldBucket = freq2bucket[oldFreq];

          // 2. 从旧桶移除key
          oldBucket->keys.erase(key);

          // 3. 处理新频率（oldFreq-1）
          int newFreq = oldFreq - 1;
          if (newFreq > 0) {
              // 新频率>0：检查桶是否存在
              if (freq2bucket.find(newFreq) == freq2bucket.end()) {
                  // 不存在：插入旧桶前面（保持频率递增）
                  insertAfter(oldBucket->prev, new Bucket(newFreq));
                  freq2bucket[newFreq] = oldBucket->prev->next;
              }
              // 将key加入新频率桶
              freq2bucket[newFreq]->keys.insert(key);
              key2freq[key] = newFreq;
          } else {
              // 新频率=0：删除key的映射
              key2freq.erase(key);
          }

          // 4. 旧桶空则删除
          if (oldBucket->keys.empty()) {
              removeBucket(oldBucket);
          }
      }

      string getMaxKey() {
          // 循环链表中，dummy->prev 是频率最大的桶
          if (dummy->prev == dummy) {
              return ""; // 空缓存
          }
          // 取最大频率桶的任意key
          return *dummy->prev->keys.begin();
      }

      string getMinKey() {
          // 循环链表中，dummy->next 是频率最小的桶
          if (dummy->next == dummy) {
              return ""; // 空缓存
          }
          // 取最小频率桶的任意key
          return *dummy->next->keys.begin();
      }

      // 析构函数：释放所有内存
      ~AllOne() {
          Bucket* cur = dummy->next;
          while (cur != dummy) {
              Bucket* next = cur->next;
              removeBucket(cur);
              cur = next;
          }
          delete dummy; // 释放唯一的dummy节点
          key2freq.clear();
          freq2bucket.clear();
      }
  };
  ```

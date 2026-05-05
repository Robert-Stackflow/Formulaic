---
title: 并查集
description: 并查集的基本原理、路径压缩、按秩合并与典型应用场景
---

## 基础连通性问题

- 并查集可以解决的问题
  - 判断是否连通
  - 连通块个数
  - 每个集合的大小
  - 合并连通图

- 典型题目
  - 朋友圈问题（多少个朋友圈）
  - 岛屿数量（二维并查集）
  - 网络连接判断

- 可以通过在并查集的 root 上挂载信息，来存储连通块的信息，例如

  ```
  size[root]      // 集合大小
  max_val[root]   // 最大值
  sum[root]       // 权值和
  ```

- 并在 `unite` 时维护：

  ```
  size[a] += size[b];
  max_val[a] = max(max_val[a], max_val[b]);
  ```

- DSU 模板

  ```cpp
  struct DSU {
      vector<int> parent, sz;
      int cnt; // 连通块个数

      // 初始化：元素个数为 n
      DSU(int n) {
          parent.resize(n + 1);  // 1-based 编号
          sz.resize(n + 1, 1);
          for (int i = 1; i <= n; ++i) parent[i] = i;
      }

      // 查找根 + 路径压缩
      int find(int x) {
          if (parent[x] != x) parent[x] = find(parent[x]);
          return parent[x];
      }

      // 合并 x 和 y
      bool unite(int x, int y) {
          x = find(x), y = find(y);
          if (x == y) return false;  // 已经在同一集合
          // 小集合合并到大集合（按大小合并）
          if (sz[x] < sz[y]) swap(x, y);
          parent[y] = x;
          sz[x] += sz[y];
          cnt--; // 合并成功则连通块个数就减一
          return true;
      }

      // 获取当前连通块数量
      int getCount() {
          return cnt;
      }

      // 判断是否连通
      bool same(int x, int y) {
          return find(x) == find(y);
      }

      // 获取 x 所在集合的大小
      int size(int x) {
          return sz[find(x)];
      }
  };
  ```

### 冗余连接

- [冗余连接](https://leetcode.cn/problems/redundant-connection/)

- 直接利用并查集，当添加某条边时，如果二者已经在一个连通图中，说明该边冗余

  ```cpp
  class DSU {
  public:
      vector<int> parent;
      vector<int> sz;
      DSU(int n) {
          parent.resize(n + 1);
          sz.resize(n + 1, 1);
          for (int i = 1; i <= n; ++i)
              parent[i] = i;
      }
      int find(int i) {
          if (parent[i] != i) {
              parent[i] = find(parent[i]);
          }
          return parent[i];
      }
      bool same(int x, int y) { return find(x) == find(y); }
      bool unite(int x, int y) {
          x = find(x), y = find(y);
          if (x == y)
              return false;
          if (sz[x] < sz[y])
              swap(x, y);
          parent[y] = x;
          sz[x] += sz[y];
          return true;
      }
  };

  class Solution {
  public:
      vector<int> findRedundantConnection(vector<vector<int>>& edges) {
          int n = edges.size();
          DSU dsu(n);
          for (auto edge : edges) {
              bool flag = dsu.unite(edge[0], edge[1]);
              if (!flag)
                  return edge;
          }
          return {};
      }
  };
  ```

## 带权并查集（维护到根的距离 / 关系）

- 代码模板

  ```cpp
  #include <iostream>
  #include <vector>
  #include <algorithm>
  using namespace std;

  // 带权并查集（维护节点到根的距离/权值）
  // T 可为 int / long long
  template<typename T>
  struct UnionFind {
      vector<int> fa;    // 父节点
      vector<T> dis;     // dis[x] = x 到 fa[x] 的权值（路径压缩后直接到根）

      // 初始化 n 个节点（0 ~ n-1）
      UnionFind(int n) {
          fa.resize(n);
          dis.resize(n, 0);
          for (int i = 0; i < n; ++i)
              fa[i] = i;
      }

      // 查找根 + 路径压缩 + 更新权值
      int find(int x) {
          if (fa[x] != x) {
              int root = find(fa[x]);
              dis[x] += dis[fa[x]];
              fa[x] = root;
          }
          return fa[x];
      }

      // 判断是否在同一集合
      bool same(int x, int y) {
          return find(x) == find(y);
      }

      // 获取 x 到 y 的相对距离：x 到根 - y 到根
      // 必须保证 same(x,y) 才有效
      T getDist(int x, int y) {
          find(x);
          find(y);
          return dis[x] - dis[y];
      }

      // 合并 x 和 y，规定 x 到 y 的权值为 val
      // 已连通：返回是否与已知条件冲突
      // 未连通：合并，返回 true
      bool unite(int x, int y, T val) {
          int rx = find(x);
          int ry = find(y);

          if (rx == ry) {
              // 检查是否满足 x 到 y = val
              return dis[x] - dis[y] == val;
          }

          // 合并两个集合，更新权值
          fa[rx] = ry;
          dis[rx] = dis[y] - dis[x] + val;
          return true;
      }
  };
  ```

### 食物链

- 有 N 个动物，分别属于 A、B、C 三类：
  - A 吃 B，B 吃 C，C 吃 A
  - 给定 K 句话，两种描述：
    1. `1 x y`：x 和 y 是同类
    2. `2 x y`：x 吃 y
  - 问：有多少句话是假话？
- 用 `dis[x]` 表示 x 与根节点的关系：
  - `dis[x] = 0`：同类
  - `dis[x] = 1`：x 被根吃
  - `dis[x] = 2`：x 吃根

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;

  template<typename T>
  struct UnionFind {
      vector<int> fa;
      vector<T> dis;

      UnionFind(int n) {
          fa.resize(n + 1);
          dis.resize(n + 1, 0);
          for (int i = 1; i <= n; ++i) fa[i] = i;
      }

      int find(int x) {
          if (fa[x] != x) {
              int root = find(fa[x]);
              dis[x] = (dis[x] + dis[fa[x]]) % 3;
              fa[x] = root;
          }
          return fa[x];
      }

      bool merge(int x, int y, int op) {
          int rx = find(x), ry = find(y);
          if (rx == ry) {
              if (op == 1) return dis[x] == dis[y];
              else return (dis[x] + 1) % 3 == dis[y];
          }
          fa[rx] = ry;
          if (op == 1) dis[rx] = (dis[y] - dis[x] + 3) % 3;
          else dis[rx] = (dis[y] - dis[x] - 1 + 3) % 3;
          return true;
      }
  };

  int main() {
      ios::sync_with_stdio(0); cin.tie(0);
      int n, k, ans = 0; cin >> n >> k;
      UnionFind<int> uf(n);
      while (k--) {
          int op, x, y; cin >> op >> x >> y;
          if (x > n || y > n) { ans++; continue; }
          if (!uf.merge(x, y, op)) ans++;
      }
      cout << ans << endl;
      return 0;
  }
  ```

### 等式 / 不等式推断

- 给定一组变量 `a1,a2...an`，M 个约束：
  - `a == b`
  - `a != b`
  - `a - b = c`
  - `a - b >= c`

- 问：这些约束是否全部自洽？

- 核心思路
  - 相等 / 差值约束 → 直接用带权并查集维护
  - 不等约束 → 检查是否在同一集合且差值矛盾

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;

  template<typename T>
  struct UnionFind {
      vector<int> fa;
      vector<T> dis;

      UnionFind(int n) {
          fa.resize(n + 1);
          dis.resize(n + 1, 0);
          for (int i = 1; i <= n; ++i) fa[i] = i;
      }

      int find(int x) {
          if (fa[x] != x) {
              int root = find(fa[x]);
              dis[x] += dis[fa[x]];
              fa[x] = root;
          }
          return fa[x];
      }

      bool merge(int x, int y, T val) {
          int rx = find(x), ry = find(y);
          if (rx == ry) return dis[x] - dis[y] == val;
          fa[rx] = ry;
          dis[rx] = dis[y] - dis[x] + val;
          return true;
      }

      bool same(int x, int y) { return find(x) == find(y); }
      T getDist(int x, int y) { return dis[x] - dis[y]; }
  };

  int main() {
      int n, m; cin >> n >> m;
      UnionFind<long long> uf(n);
      bool ok = 1;
      while (m--) {
          int op, a, b, c;
          cin >> op >> a >> b;
          if (op == 1) ok &= uf.merge(a, b, 0);
          if (op == 2) { cin >> c; ok &= uf.merge(a, b, c); }
          if (op == 3) {
              if (uf.same(a,b) && uf.getDist(a,b) == 0) ok = 0;
          }
      }
      cout << (ok ? "YES" : "NO") << endl;
      return 0;
  }
  ```

### 奇偶游戏

- 一个 01 序列，多次询问：
  - `l r odd`：[l,r] 内 1 的个数是奇数

  - `l r even`：[l,r] 内 1 的个数是偶数
  - 问：最多有多少句话是真的？

- 核心思路：前缀和 `s[0],s[1]...s[n]`
  - `even` → `s[r] - s[l-1] = 0`
  - `odd` → `s[r] - s[l-1] = 1`

  - 用 `dis` 维护奇偶性（模 2）

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;

  template<typename T>
  struct UnionFind {
      vector<int> fa;
      vector<T> dis;

      UnionFind(int n) {
          fa.resize(n + 1);
          dis.resize(n + 1, 0);
          for (int i = 0; i <= n; ++i) fa[i] = i;
      }

      int find(int x) {
          if (fa[x] != x) {
              int root = find(fa[x]);
              dis[x] ^= dis[fa[x]];
              fa[x] = root;
          }
          return fa[x];
      }

      bool merge(int x, int y, int val) {
          int rx = find(x), ry = find(y);
          if (rx == ry) return (dis[x] ^ dis[y]) == val;
          fa[rx] = ry;
          dis[rx] = dis[x] ^ dis[y] ^ val;
          return true;
      }
  };

  int main() {
      int n, m, ans = 0; cin >> n >> m;
      UnionFind<int> uf(n);
      while (m--) {
          int l, r; string s;
          cin >> l >> r >> s;
          int val = (s == "odd");
          if (uf.merge(l-1, r, val)) ans++;
          else break;
      }
      cout << ans << endl;
      return 0;
  }
  ```

### 节点间距离维护

- 一棵树 / 图，动态加边，动态查询：
  - `u v w`：u 到 v 的距离为 w
  - `? u v`：查询 u 到 v 的距离

- 最标准的带权并查集用法：
  - `dis[x]` = x 到根的距离
  - `u 到 v 的距离 = dis[u] - dis[v]`

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;

  template<typename T>
  struct UnionFind {
      vector<int> fa;
      vector<T> dis;

      UnionFind(int n) {
          fa.resize(n + 1);
          dis.resize(n + 1, 0);
          for (int i = 1; i <= n; ++i) fa[i] = i;
      }

      int find(int x) {
          if (fa[x] != x) {
              int root = find(fa[x]);
              dis[x] += dis[fa[x]];
              fa[x] = root;
          }
          return fa[x];
      }

      void merge(int x, int y, T val) {
          int rx = find(x), ry = find(y);
          if (rx == ry) return;
          fa[rx] = ry;
          dis[rx] = dis[y] - dis[x] + val;
      }

      T getDist(int x, int y) {
          find(x); find(y);
          return dis[x] - dis[y];
      }
  };

  int main() {
      int n, m; cin >> n >> m;
      UnionFind<long long> uf(n);
      while (m--) {
          char op; int u, v, w;
          cin >> op;
          if (op == '+') {
              cin >> u >> v >> w;
              uf.merge(u, v, w);
          } else {
              cin >> u >> v;
              cout << uf.getDist(u, v) << '\n';
          }
      }
      return 0;
  }
  ```

## 并查集+懒删除

### 美团 2027 届实习第二轮笔试

- 给定一个由 `n` 个编号为 `1~n` 的节点和 `m` 条编号为 `1~m` 的边组成的无向图
  - 节点权值定义：节点编号 + 当前度数（度数是执行完之前所有操作后的边数）
  - 共 `q` 次操作，分为两类：
    1.  操作一：断开编号为 `x` 的边（保证每条边至多被删除一次，删除时一定存在）
    2.  操作二：查询编号为 `x` 的节点所在连通块中，所有节点的最大权值

- 输入输出
  - 输入：
    1.  第一行：`n, m, q`（节点数、边数、操作数）
    2.  接下来 `m` 行：每行两个整数 `u, v`，表示第 `i` 条边连接节点 `u` 和 `v`
    3.  接下来 `q` 行：每行描述一个操作：
        - `1 x`：删除第 `x` 条边
        - `2 x`：查询节点 `x` 所在连通块的最大权值
  - 输出：对每个操作二，输出一行表示该连通块的最大权值

- 数据范围
  - 节点数 `n`、边数 `m`、操作数 `q` 均在 `1e5` 级别，需要高效离线算法

- 并查集不支持高效删除边，但支持高效合并，因此采用离线逆序处理：
  - 先把所有要删除的边标记出来，初始图只保留未被删除的边
  - 逆序执行操作：
    - 原操作一（删边）→ 逆序变为加边（用并查集合并）
    - 原操作二（查询）→ 逆序时记录答案，最后再反转输出
  - 并查集需要额外维护每个连通块的最大权值，合并时更新最大值

- 额外细节
  - 节点初始权值：`w[i] = i + 初始度数`（初始度数是该节点在未被删除边中的连接数）
  - 并查集结构：每个根节点维护当前连通块的最大权值，合并两个连通块时，新的最大值为两个子块最大值的较大者

- 代码实现

  ```cpp
  #include <bits/stdc++.h>
  using namespace std;

  const int MAXN = 1e5 + 5;
  const int MAXM = 1e5 + 5;
  const int MAXQ = 1e5 + 5;

  struct DSU {
      vector<int> parent;
      vector<int> max_val; // 维护每个连通块的最大权值

      DSU(int n, const vector<int>& w) {
          parent.resize(n + 1);
          max_val.resize(n + 1);
          for (int i = 1; i <= n; ++i) {
              parent[i] = i;
              max_val[i] = w[i];
          }
      }

      int find(int x) {
          if (parent[x] != x) {
              parent[x] = find(parent[x]);
          }
          return parent[x];
      }

      void unite(int x, int y) {
          x = find(x);
          y = find(y);
          if (x == y) return;
          // 小的合并到大的，同时更新最大值
          parent[y] = x;
          max_val[x] = max(max_val[x], max_val[y]);
      }

      int get_max(int x) {
          return max_val[find(x)];
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      int n, m, q;
      cin >> n >> m >> q;

      vector<pair<int, int>> edges(m + 1); // 边从1开始编号
      vector<int> deg(n + 1, 0);
      vector<bool> deleted(m + 1, false);

      for (int i = 1; i <= m; ++i) {
          int u, v;
          cin >> u >> v;
          edges[i] = {u, v};
      }

      vector<tuple<int, int>> ops(q);
      for (int i = 0; i < q; ++i) {
          int op, x;
          cin >> op >> x;
          ops[i] = {op, x};
          if (op == 1) {
              deleted[x] = true; // 标记要删除的边
          }
      }

      // 计算初始度数（只算未被删除的边）
      fill(deg.begin(), deg.end(), 0);
      for (int i = 1; i <= m; ++i) {
          if (!deleted[i]) {
              auto [u, v] = edges[i];
              deg[u]++;
              deg[v]++;
          }
      }

      // 初始权值 w[i] = i + deg[i]
      vector<int> w(n + 1);
      for (int i = 1; i <= n; ++i) {
          w[i] = i + deg[i];
      }

      DSU dsu(n, w);

      // 先把所有未被删除的边合并
      for (int i = 1; i <= m; ++i) {
          if (!deleted[i]) {
              auto [u, v] = edges[i];
              dsu.unite(u, v);
          }
      }

      vector<int> ans;
      // 逆序处理操作
      for (int i = q - 1; i >= 0; --i) {
          auto [op, x] = ops[i];
          if (op == 1) {
              // 原操作是删边x，逆序就是加边x
              auto [u, v] = edges[x];
              dsu.unite(u, v);
          } else {
              // 原操作是查询x，记录当前连通块最大值
              ans.push_back(dsu.get_max(x));
          }
      }

      // 答案逆序输出
      reverse(ans.begin(), ans.end());
      for (int x : ans) {
          cout << x << '\n';
      }

      return 0;
  }
  ```

## 区间连通查询问题

### 阿里 2027 届实习 3.25 笔试

- 有编号为 1 ~ n 的 n 个城市，初始时所有城市互相独立、互不连通

- 共有 m 次操作，每次操作包含三个参数 `a, b, x`：
  1.  操作：将编号在区间 `[a, b]` 内的所有城市两两连通（即把这个区间变成一个完整的连通块）；
  2.  查询：输出从城市 x 出发，能够到达的最大编号城市

- 要求对每次查询，快速输出正确结果

- 输入格式
  - 第一行：两个整数 `n, m`，分别表示城市总数、操作次数
  - 接下来 m 行：每行三个整数 `a, b, x`，表示一次操作与查询

- 输出格式
  - 共 m 行，每行一个整数，表示对应查询的答案

- 数据范围
  - 城市数量 n 可以极大（可达 1e9 级别）
  - 操作次数 m 为常规范围（1e6 以内）
  - 1 ≤ a ≤ b ≤ n，1 ≤ x ≤ n

- 输入示例

  ```text
  5 3
  1 3 2
  2 5 1
  1 5 4
  ```

- 输出示例

  ```text
  3
  5
  5
  ```

- 样例解释
  - 第一次操作：连通 [1,3]，从 2 出发能到的最大城市是 3
  - 第二次操作：连通 [2,5]，从 1 出发能到的最大城市是 5
  - 第三次操作：连通 [1,5]（已连通），从 4 出发能到的最大城市是 5

- 最简单地，考虑并查集，对于每个区间，遍历区间内任意两个城市，加入并查集中

  ```cpp

  ```

- 显然，这种做法会超时，那么如何用 DSU 来解决区间连通查询问题？

- 需要用并查集 + 路径跳跃来高效处理区间合并：
  - 维护 `parent[i]`：表示从 `i` 出发，下一个需要合并的位置
  - 每次合并 `[l, r]` 时，从 `l` 开始，不断合并 `i` 和 `i+1`，并将 `i` 的父节点设为 `i+1`，直到 `i >= r`
  - 这样可以保证每个位置最多被合并一次，整体时间复杂度为 `O(n α(n) + m α(n))`，可以通过题目数据范围

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;

  const int MAXN = 1e6 + 10; // 按题目n上限调整

  vector<int> parent;

  int find(int x) {
      if (parent[x] != x) {
          parent[x] = find(parent[x]);
      }
      return parent[x];
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      int n, m;
      cin >> n >> m;

      parent.resize(n + 2); // 1-based 编号，多开一位防止越界
      for (int i = 1; i <= n + 1; i++) {
          parent[i] = i;
      }

      while (m--) {
          int l, r, x;
          cin >> l >> r >> x;

          // 合并 [l, r] 区间
          for (int i = find(l); i < r; i = find(i)) {
              parent[i] = i + 1;
          }

          // 查询 x 能到达的最大城市编号
          cout << find(x) << '\n';
      }

      return 0;
  }
  ```

- 把问题转化为区间删除问题，用并查集维护每个点的 next 指针吗，而 find(x) 返回当前未被删除的最小 ≥x 的位置

- 每个点最多被删除一次，因此整体复杂度是近似线性的

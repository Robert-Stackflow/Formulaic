---
title: 图论
description: 图的基本概念、存储方式、遍历算法（DFS/BFS）与经典问题
---

## 图论基础

- 图可以分为两大类：有向图和无向图
- 度：
  - 无向图中有几条边连接该节点，该节点就有几度
  - 在有向图中，每个节点有出度和入度
    - 出度：从该节点出发的边的个数
    - 入度：指向该节点边的个数
- 连通性
  - 在无向图中，如果任何两个节点都是可以到达的，称之为连通图；如果有节点不能到达其他节点，则为非连通图
  - 在有向图中，如果任何两个节点是可以相互到达的，称之为强连通图
  - 强连通图是在有向图中任何两个节点是可以相互到达
  - 在无向图中的极大连通子图称之为该图的一个连通分量
  - 在有向图中极大强连通子图称之为该图的强连通分量
- 图的构造
  - 一般使用邻接表、邻接矩阵或者用类来表示
  - 朴素存储
    - 用数组存储所有边
    - 搜索中，需要知道 节点与其他节点的连接情况，而这种朴素存储，都需要全部枚举才知道连接情况
  - 邻接表
    - 使用数组 + 链表的方式来表示
    - 从边的数量来表示图，有多少边才会申请对应大小的链表
    - 对于稀疏图的存储，只需要存储边，空间利用率高
    - 遍历节点连接情况相对容易
    - 检查任意两个节点间是否存在边，效率相对低，需要 O(V) 时间，V表示某节点连接其他节点的数量
  - 邻接矩阵
    - 使用二维数组表示，从节点的角度来表示
    - 在边少，节点多的情况下，会导致申请过大的二维数组，造成空间浪费
    - 在寻找节点连接情况的时候，需要遍历整个矩阵，即 n \* n 的时间复杂度，同样造成时间浪费
    - 适合稠密图，在边数接近顶点数平方的图中，邻接矩阵是一种空间效率较高的表示方法
    - 检查任意两个顶点间是否存在边的操作非常快
- 图的遍历方式
  - 深度优先搜索（dfs）
  - 广度优先搜索（bfs）

## 深度优先搜索

- 搜索方向：认准一个方向搜，直到碰壁之后再换方向

- 换方向：撤销原路径，改为节点连接的下一个路径，就是回溯的过程

- 二叉树的递归法其实就是 dfs，而二叉树的迭代法，就是 bfs

- DFS 的代码框架

  ```cpp
  void dfs(参数) {
      if (终止条件) {
          存放结果;
          return;
      }

      for (选择：本节点所连接的其他节点) {
          处理节点;
          dfs(图，选择的节点); // 递归
          回溯，撤销处理结果
      }
  }

  ```

- 实际上，这与回溯算法的代码框架是很类似的

  ```cpp
  void backtracking(参数) {
      if (终止条件) {
          存放结果;
          return;
      }
      for (选择：本层集合中元素（树中节点孩子的数量就是集合的大小）) {
          处理节点;
          backtracking(路径，选择列表); // 递归
          回溯，撤销处理结果
      }
  }
  ```

- 深度搜索的流程
  - 确认递归函数、递归函数的参数：一般情况下，深度搜索需要二维数组结构保存所有路径，需要一维数组保存单一路径

    ```cpp
    vector<vector<int>> result; // 保存符合条件的所有路径
    vector<int> path; // 起点到终点的路径
    void dfs (图，目前搜索的节点)
    ```

  - 确认终止条件
  - 处理目前搜索节点发出的路径

### 可达路径

- 给定一个有 n 个节点的有向无环图，节点编号从 1 到 n。请编写一个程序，找出并返回所有从节点 1 到节点 n 的路径。每条路径应以节点编号的列表形式表示

- 图中不存在自环、图中不存在平行边

- 邻接矩阵写法

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;
  vector<vector<int>> result; // 收集符合条件的路径
  vector<int> path; // 1节点到终点的路径

  void dfs (const vector<vector<int>>& graph, int x, int n) {
      // 当前遍历的节点x 到达节点n
      if (x == n) { // 找到符合条件的一条路径
          result.push_back(path);
          return;
      }
      for (int i = 1; i <= n; i++) { // 遍历节点x链接的所有节点
          if (graph[x][i] == 1) { // 找到 x链接的节点
              path.push_back(i); // 遍历到的节点加入到路径中来
              dfs(graph, i, n); // 进入下一层递归
              path.pop_back(); // 回溯，撤销本节点
          }
      }
  }

  int main() {
      int n, m, s, t;
      cin >> n >> m;

      // 节点编号从1到n，所以申请 n+1 这么大的数组
      vector<vector<int>> graph(n + 1, vector<int>(n + 1, 0));

      while (m--) {
          cin >> s >> t;
          // 使用邻接矩阵 表示无线图，1 表示 s 与 t 是相连的
          graph[s][t] = 1;
      }

      path.push_back(1); // 无论什么路径已经是从0节点出发
      dfs(graph, 1, n); // 开始遍历

      // 输出结果
      if (result.size() == 0) cout << -1 << endl;
      for (const vector<int> &pa : result) {
          for (int i = 0; i < pa.size() - 1; i++) {
              cout << pa[i] << " ";
          }
          cout << pa[pa.size() - 1]  << endl;
      }
  }
  ```

- 邻接表写法

  ```cpp
  #include <iostream>
  #include <vector>
  #include <list>
  using namespace std;

  vector<vector<int>> result; // 收集符合条件的路径
  vector<int> path; // 1节点到终点的路径

  void dfs (const vector<list<int>>& graph, int x, int n) {

      if (x == n) { // 找到符合条件的一条路径
          result.push_back(path);
          return;
      }
      for (int i : graph[x]) { // 找到 x指向的节点
          path.push_back(i); // 遍历到的节点加入到路径中来
          dfs(graph, i, n); // 进入下一层递归
          path.pop_back(); // 回溯，撤销本节点
      }
  }

  int main() {
      int n, m, s, t;
      cin >> n >> m;

      // 节点编号从1到n，所以申请 n+1 这么大的数组
      vector<list<int>> graph(n + 1); // 邻接表
      while (m--) {
          cin >> s >> t;
          // 使用邻接表 ，表示 s -> t 是相连的
          graph[s].push_back(t);

      }

      path.push_back(1); // 无论什么路径已经是从0节点出发
      dfs(graph, 1, n); // 开始遍历

      // 输出结果
      if (result.size() == 0) cout << -1 << endl;
      for (const vector<int> &pa : result) {
          for (int i = 0; i < pa.size() - 1; i++) {
              cout << pa[i] << " ";
          }
          cout << pa[pa.size() - 1]  << endl;
      }
  }
  ```

- 参考题目
  - [98. 可达路径](https://kamacoder.com/problempage.php?pid=1170)
  - [797. 所有可能的路径](https://leetcode.cn/problems/all-paths-from-source-to-target/description/)
  - [1976. 到达目的地的方案数](https://leetcode.cn/problems/number-of-ways-to-arrive-at-destination/)
  - [2328. 网格图中递增路径的数目](https://leetcode.cn/problems/number-of-increasing-paths-in-a-grid/description/)

### 美团 2027 届实习第二次笔试

- 给定一棵以根节点 1 为根的无向树，节点编号为 $1, 2, \dots, n$，每个节点 $i$ 的权值为 $x_i$
- 对于每个节点 $i\ (i > 1)$：
  - 沿原树从 $i$ 到根 $1$ 的路径，找到离节点 $i$ 最近的第一个权值严格大于 $x_i$ 的祖先节点 $j$；
  - 若 $j$ 存在，则在节点 $i$ 与 $j$ 之间添加一条额外的无向边；否则不进行任何操作

- 在加入所有额外边之后，计算每个节点到根节点 1 的最短距离（以边数计）
- 有两个问题需要解决
  - 找最近更大祖先：
    - 对树做深度优先遍历（DFS）或广度优先遍历（BFS），维护一个单调栈，栈中保存从根到当前节点路径上的节点，且权值单调递减
    - 对于节点 `i`，弹出栈中所有权值 ≤ `x_i` 的节点，栈顶即为离 `i` 最近的、权值严格大于 `x_i` 的祖先 `j`
    - 将 `i` 入栈，递归处理子树，回溯时弹出 `i`（恢复栈状态）
  - 建图与求最短路：
    - 原树边 + 新增的 `i-j` 边共同构成新图
    - 因为所有边权均为 1，使用 BFS 从根节点 1 出发，即可得到每个节点的最短距离

- 算法步骤
  - 建树：根据输入构建原树的邻接表
  - 单调栈找跳跃边：
    - 遍历树，用单调栈维护路径上的递减权值序列
    - 对每个节点 `i`，找到目标祖先 `j`，若存在则添加边 `(i, j)`
  - BFS 求最短距离：
    - 从根节点 1 开始 BFS，记录每个节点的最短距离 `dist[i]`
    - 根节点 `dist[1] = 0`，其余节点初始化为 `-1`（未访问）

- 代码实现

  ```cpp
  #include <bits/stdc++.h>
  using namespace std;

  const int MAXN = 2e5 + 5;

  vector<int> adj[MAXN];  // 原树邻接表
  vector<int> jump[MAXN]; // 跳跃边邻接表
  int x[MAXN], dist[MAXN];
  stack<int> st;

  void dfs(int u, int fa) {
      // 弹出所有权值 <= x[u] 的节点
      while (!st.empty() && x[st.top()] <= x[u]) {
          st.pop();
      }
      // 如果栈不为空，添加跳跃边
      if (!st.empty()) {
          jump[u].push_back(st.top());
          jump[st.top()].push_back(u);
      }
      st.push(u);
      // 递归处理子节点
      for (int v : adj[u]) {
          if (v != fa) {
              dfs(v, u);
          }
      }
      // 回溯，恢复栈
      st.pop();
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      for (int i = 1; i <= n; i++) {
          cin >> x[i];
      }
      for (int i = 1; i < n; i++) {
          int u, v;
          cin >> u >> v;
          adj[u].push_back(v);
          adj[v].push_back(u);
      }
      // 单调栈找跳跃边
      dfs(1, 0);
      // 合并原树边和跳跃边，构建最终邻接表
      vector<int> g[MAXN];
      for (int i = 1; i <= n; i++) {
          for (int v : adj[i]) g[i].push_back(v);
          for (int v : jump[i]) g[i].push_back(v);
      }
      // BFS求最短距离
      memset(dist, -1, sizeof(dist));
      queue<int> q;
      q.push(1);
      dist[1] = 0;
      while (!q.empty()) {
          int u = q.front();
          q.pop();
          for (int v : g[u]) {
              if (dist[v] == -1) {
                  dist[v] = dist[u] + 1;
                  q.push(v);
              }
          }
      }
      // 输出结果
      for (int i = 1; i <= n; i++) {
          cout << dist[i] << " ";
      }
      cout << endl;
      return 0;
  }
  ```

## 广度优先搜索

- 广度优先搜索适合于解决两个点之间的最短路径问题，因为BFS 是从起点出发，以起始点为中心一圈一圈进行搜索，一旦遇到终点，记录之前走过的节点就是一条最短路径

- BFS 仅仅需要一个容器，保存遍历过的元素即可，可以用队列、栈或者数组

- 如果使用队列，就是保证每一圈都是一个方向去遍历

- 如果使用栈，就是第一圈顺时针，第二圈逆时针，以此往复

- 代码示例

  ```cpp
  int dir[4][2] = {0, 1, 1, 0, -1, 0, 0, -1}; // 表示四个方向
  // grid 是地图，也就是一个二维数组
  // visited标记访问过的节点，不要重复访问
  // x,y 表示开始搜索节点的下标
  void bfs(vector<vector<char>>& grid, vector<vector<bool>>& visited, int x, int y) {
      queue<pair<int, int>> que; // 定义队列
      que.push({x, y}); // 起始节点加入队列
      visited[x][y] = true; // 只要加入队列，立刻标记为访问过的节点
      while(!que.empty()) { // 开始遍历队列里的元素
          pair<int ,int> cur = que.front(); que.pop(); // 从队列取元素
          int curx = cur.first;
          int cury = cur.second; // 当前节点坐标
          for (int i = 0; i < 4; i++) { // 开始想当前节点的四个方向左右上下去遍历
              int nextx = curx + dir[i][0];
              int nexty = cury + dir[i][1]; // 获取周边四个方向的坐标
              if (nextx < 0 || nextx >= grid.size() || nexty < 0 || nexty >= grid[0].size()) continue;  // 坐标越界了，直接跳过
              if (!visited[nextx][nexty]) { // 如果节点没被访问过
                  que.push({nextx, nexty});  // 队列添加该节点为下一轮要遍历的节点
                  visited[nextx][nexty] = true; // 只要加入队列立刻标记，避免重复访问
              }
          }
      }

  }
  ```

## 连通块

- 连通块（Connected Component），也叫连通分量，是图论与网格问题中最基础的概念之一：一个极大的连通子图 / 区域，内部任意两点可达，且无法再加入其他点仍保持连通

- DFS 实现

  ```cpp
  // 网格DFS：统计4-连通块数（LeetCode 200）
  int numIslands(vector<vector<char>>& grid) {
      if (grid.empty()) return 0;
      int m = grid.size(), n = grid[0].size(), cnt = 0;
      // 方向数组：上下左右
      const int dx[] = {-1, 1, 0, 0}, dy[] = {0, 0, -1, 1};

      function<void(int, int)> dfs = [&](int x, int y) {
          if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] == '0') return;
          grid[x][y] = '0'; // 标记已访问
          for (int d = 0; d < 4; ++d) dfs(x+dx[d], y+dy[d]);
      };

      for (int i = 0; i < m; ++i)
          for (int j = 0; j < n; ++j)
              if (grid[i][j] == '1') { cnt++; dfs(i,j); }
      return cnt;
  }
  ```

- BFS 实现

  ```cpp
  // 网格BFS
  int numIslands(vector<vector<char>>& grid) {
      if (grid.empty()) return 0;
      int m = grid.size(), n = grid[0].size(), cnt = 0;
      const int dx[] = {-1,1,0,0}, dy[] = {0,0,-1,1};
      queue<pair<int,int>> q;

      for (int i=0; i<m; i++) {
          for (int j=0; j<n; j++) {
              if (grid[i][j] == '1') {
                  cnt++;
                  q.push({i,j}); grid[i][j] = '0';
                  while (!q.empty()) {
                      auto [x,y] = q.front(); q.pop();
                      for (int d=0; d<4; d++) {
                          int nx = x+dx[d], ny = y+dy[d];
                          if (nx>=0&&nx<m&&ny>=0&&ny<n&&grid[nx][ny]=='1') {
                              grid[nx][ny] = '0';
                              q.push({nx,ny});
                          }
                      }
                  }
              }
          }
      }
      return cnt;
  }
  ```

- 并查集实现，适合动态连通、多次查询两点是否连通、统计块数

  ```cpp
  // 并查集模板
  struct DSU {
      vector<int> parent;
      DSU(int n) : parent(n) { iota(parent.begin(), parent.end(), 0); }
      int find(int x) {
          if (parent[x] != x) parent[x] = find(parent[x]); // 路径压缩
          return parent[x];
      }
      void unite(int x, int y) { parent[find(x)] = find(y); }
  };

  // 网格转并查集：统计连通块
  int numIslands(vector<vector<char>>& grid) {
      if (grid.empty()) return 0;
      int m = grid.size(), n = grid[0].size();
      DSU dsu(m*n);
      int cnt = 0;
      const int dx[] = {-1,1,0,0}, dy[] = {0,0,-1,1};
      for (int i=0; i<m; i++) {
          for (int j=0; j<n; j++) {
              if (grid[i][j] == '1') {
                  cnt++;
                  for (int d=0; d<4; d++) {
                      int ni = i+dx[d], nj = j+dy[d];
                      if (ni>=0&&ni<m&&nj>=0&&nj<n&&grid[ni][nj]=='1') {
                          if (dsu.find(i*n+j) != dsu.find(ni*n+nj)) {
                              dsu.unite(i*n+j, ni*n+nj);
                              cnt--;
                          }
                      }
                  }
              }
          }
      }
      return cnt;
  }
  ```

- 「数组转连通块」的题目核心规律：
  1.  抽象节点：把数组 / 矩阵中的元素（城市、变量、位置）抽象成图的「节点」；
  2.  定义连通：把元素间的关系（相邻、相等、相连）抽象成图的「边」；
  3.  解决问题：用 DFS/BFS/ 并查集 统计连通块数量，或验证连通性

## 岛屿问题

### 孤岛计数 DFS

- 给定一个由 1（陆地）和 0（水）组成的矩阵，需要计算岛屿的数量。岛屿由水平方向或垂直方向上相邻的陆地连接而成，并且四周都是水域。可以假设矩阵外均被水包围

- 输出一个整数，表示岛屿的数量。如果不存在岛屿，则输出 0

- 遇到一个没有遍历过的节点陆地，计数器就加一，然后把该节点陆地所能遍历到的陆地都标记上，在遇到标记过的陆地节点和海洋节点的时候直接跳过， 这样计数器就是最终岛屿的数量

- 深度优先搜索代码

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;

  int dir[4][2] = {0, 1, 1, 0, -1, 0, 0, -1}; // 四个方向
  void dfs(const vector<vector<int>>& grid, vector<vector<bool>>& visited, int x, int y) {
      for (int i = 0; i < 4; i++) {
          int nextx = x + dir[i][0];
          int nexty = y + dir[i][1];
          if (nextx < 0 || nextx >= grid.size() || nexty < 0 || nexty >= grid[0].size()) continue;  // 越界了，直接跳过
          if (!visited[nextx][nexty] && grid[nextx][nexty] == 1) { // 没有访问过的 同时 是陆地的

              visited[nextx][nexty] = true;
              dfs(grid, visited, nextx, nexty);
          }
      }
  }

  int main() {
      int n, m;
      cin >> n >> m;
      vector<vector<int>> grid(n, vector<int>(m, 0));
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              cin >> grid[i][j];
          }
      }

      vector<vector<bool>> visited(n, vector<bool>(m, false));

      int result = 0;
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              if (!visited[i][j] && grid[i][j] == 1) {
                  visited[i][j] = true;
                  result++; // 遇到没访问过的陆地，+1
                  dfs(grid, visited, i, j); // 将与其链接的陆地都标记上 true
              }
          }
      }

      cout << result << endl;
  }
  ```

- 参考题目
  - [99. 计数孤岛](https://kamacoder.com/problempage.php?pid=1171)

### 孤岛计数 BFS

- 只要加入队列就代表走过，就需要标记，而不是从队列拿出来的时候再去标记走过

- 否则会导致很多节点重复加入队列

- 超时写法

  ```cpp
  int dir[4][2] = {0, 1, 1, 0, -1, 0, 0, -1}; // 四个方向
  void bfs(vector<vector<char>>& grid, vector<vector<bool>>& visited, int x, int y) {
      queue<pair<int, int>> que;
      que.push({x, y});
      while(!que.empty()) {
          pair<int ,int> cur = que.front(); que.pop();
          int curx = cur.first;
          int cury = cur.second;
          visited[curx][cury] = true; // 从队列中取出在标记走过
          for (int i = 0; i < 4; i++) {
              int nextx = curx + dir[i][0];
              int nexty = cury + dir[i][1];
              if (nextx < 0 || nextx >= grid.size() || nexty < 0 || nexty >= grid[0].size()) continue;  // 越界了，直接跳过
              if (!visited[nextx][nexty] && grid[nextx][nexty] == '1') {
                  que.push({nextx, nexty});
              }
          }
      }

  }
  ```

- 正确写法

  ```cpp
  #include <iostream>
  #include <vector>
  #include <queue>
  using namespace std;

  int dir[4][2] = {0, 1, 1, 0, -1, 0, 0, -1}; // 四个方向
  void bfs(const vector<vector<int>>& grid, vector<vector<bool>>& visited, int x, int y) {
      queue<pair<int, int>> que;
      que.push({x, y});
      visited[x][y] = true; // 只要加入队列，立刻标记
      while(!que.empty()) {
          pair<int ,int> cur = que.front(); que.pop();
          int curx = cur.first;
          int cury = cur.second;
          for (int i = 0; i < 4; i++) {
              int nextx = curx + dir[i][0];
              int nexty = cury + dir[i][1];
              if (nextx < 0 || nextx >= grid.size() || nexty < 0 || nexty >= grid[0].size()) continue;  // 越界了，直接跳过
              if (!visited[nextx][nexty] && grid[nextx][nexty] == 1) {
                  que.push({nextx, nexty});
                  visited[nextx][nexty] = true; // 只要加入队列立刻标记
              }
          }
      }
  }

  int main() {
      int n, m;
      cin >> n >> m;
      vector<vector<int>> grid(n, vector<int>(m, 0));
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              cin >> grid[i][j];
          }
      }

      vector<vector<bool>> visited(n, vector<bool>(m, false));

      int result = 0;
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              if (!visited[i][j] && grid[i][j] == 1) {
                  result++; // 遇到没访问过的陆地，+1
                  bfs(grid, visited, i, j); // 将与其链接的陆地都标记上 true
              }
          }
      }


      cout << result << endl;
  }
  ```

### 最大岛屿的面积

- 给定一个由 1（陆地）和 0（水）组成的矩阵，计算岛屿的最大面积。岛屿面积的计算方式为组成岛屿的陆地的总数。岛屿由水平方向或垂直方向上相邻的陆地连接而成，并且四周都是水域。你可以假设矩阵外均被水包围

- 输出一个整数，表示岛屿的最大面积

- DFS 实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;

  int count;
  int dir[4][2] = {0, 1, 1, 0, -1, 0, 0, -1}; // 四个方向
  void dfs(vector<vector<int>>& grid, vector<vector<bool>>& visited, int x, int y) {
      if (visited[x][y] || grid[x][y] == 0) return; // 终止条件：访问过的节点 或者 遇到海水
      visited[x][y] = true; // 标记访问过
      count++;
      for (int i = 0; i < 4; i++) {
          int nextx = x + dir[i][0];
          int nexty = y + dir[i][1];
          if (nextx < 0 || nextx >= grid.size() || nexty < 0 || nexty >= grid[0].size()) continue;  // 越界了，直接跳过
          dfs(grid, visited, nextx, nexty);
      }
  }

  int main() {
      int n, m;
      cin >> n >> m;
      vector<vector<int>> grid(n, vector<int>(m, 0));
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              cin >> grid[i][j];
          }
      }
      vector<vector<bool>> visited = vector<vector<bool>>(n, vector<bool>(m, false));
      int result = 0;
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              if (!visited[i][j] && grid[i][j] == 1) {
                  count = 0; // 因为dfs处理当前节点，所以遇到陆地计数为0，进dfs之后在开始从1计数
                  dfs(grid, visited, i, j); // 将与其链接的陆地都标记上 true
                  result = max(result, count);
              }
          }
      }
      cout << result << endl;
  }
  ```

- BFS 实现

  ```cpp
  class Solution {
  private:
      int count;
      int dir[4][2] = {0, 1, 1, 0, -1, 0, 0, -1}; // 四个方向
      void bfs(vector<vector<int>>& grid, vector<vector<bool>>& visited, int x, int y) {
          queue<int> que;
          que.push(x);
          que.push(y);
          visited[x][y] = true; // 加入队列就意味节点是陆地可到达的点
          count++;
          while(!que.empty()) {
              int xx = que.front();que.pop();
              int yy = que.front();que.pop();
              for (int i = 0 ;i < 4; i++) {
                  int nextx = xx + dir[i][0];
                  int nexty = yy + dir[i][1];
                  if (nextx < 0 || nextx >= grid.size() || nexty < 0 || nexty >= grid[0].size()) continue; // 越界
                  if (!visited[nextx][nexty] && grid[nextx][nexty] == 1) { // 节点没有被访问过且是陆地
                      visited[nextx][nexty] = true;
                      count++;
                      que.push(nextx);
                      que.push(nexty);
                  }
              }
          }
      }

  public:
      int maxAreaOfIsland(vector<vector<int>>& grid) {
          int n = grid.size(), m = grid[0].size();
          vector<vector<bool>> visited = vector<vector<bool>>(n, vector<bool>(m, false));
          int result = 0;
          for (int i = 0; i < n; i++) {
              for (int j = 0; j < m; j++) {
                  if (!visited[i][j] && grid[i][j] == 1) {
                      count = 0;
                      bfs(grid, visited, i, j); // 将与其链接的陆地都标记上 true
                      result = max(result, count);
                  }
              }
          }
          return result;
      }
  };
  ```

- 参考题目
  - [100. 最大岛屿的面积](https://kamacoder.com/problempage.php?pid=1172)

### 孤岛的总面积

- 给定一个由 1（陆地）和 0（水）组成的矩阵，岛屿指的是由水平或垂直方向上相邻的陆地单元格组成的区域，且完全被水域单元格包围。孤岛是那些位于矩阵内部、所有单元格都不接触边缘的岛屿

- 现在需要计算所有孤岛的总面积，岛屿面积的计算方式为组成岛屿的陆地的总数

- 这道题要找到不靠边的陆地面积，可以从周边找到陆地，然后通过 DFS/BFS 将周边靠陆地且相邻的陆地变为海洋，这样重新遍历地图统计剩下的陆地即可

- DFS 实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;
  int dir[4][2] = {-1, 0, 0, -1, 1, 0, 0, 1}; // 保存四个方向
  void dfs(vector<vector<int>>& grid, int x, int y) {
      grid[x][y] = 0;
      for (int i = 0; i < 4; i++) { // 向四个方向遍历
          int nextx = x + dir[i][0];
          int nexty = y + dir[i][1];
          // 超过边界
          if (nextx < 0 || nextx >= grid.size() || nexty < 0 || nexty >= grid[0].size()) continue;
          // 不符合条件，不继续遍历
          if (grid[nextx][nexty] == 0) continue;

          dfs (grid, nextx, nexty);
      }
      return;
  }

  int main() {
      int n, m;
      cin >> n >> m;
      vector<vector<int>> grid(n, vector<int>(m, 0));
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              cin >> grid[i][j];
          }
      }

      // 从左侧边，和右侧边 向中间遍历
      for (int i = 0; i < n; i++) {
          if (grid[i][0] == 1) dfs(grid, i, 0);
          if (grid[i][m - 1] == 1) dfs(grid, i, m - 1);
      }
      // 从上边和下边 向中间遍历
      for (int j = 0; j < m; j++) {
          if (grid[0][j] == 1) dfs(grid, 0, j);
          if (grid[n - 1][j] == 1) dfs(grid, n - 1, j);
      }
      int count = 0;
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              if (grid[i][j] == 1) count++;
          }
      }
      cout << count << endl;
  }
  ```

- BFS 实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <queue>
  using namespace std;
  int dir[4][2] = {0, 1, 1, 0, -1, 0, 0, -1}; // 四个方向
  void bfs(vector<vector<int>>& grid, int x, int y) {
      queue<pair<int, int>> que;
      que.push({x, y});
      grid[x][y] = 0; // 只要加入队列，立刻标记
      while(!que.empty()) {
          pair<int ,int> cur = que.front(); que.pop();
          int curx = cur.first;
          int cury = cur.second;
          for (int i = 0; i < 4; i++) {
              int nextx = curx + dir[i][0];
              int nexty = cury + dir[i][1];
              if (nextx < 0 || nextx >= grid.size() || nexty < 0 || nexty >= grid[0].size()) continue;  // 越界了，直接跳过
              if (grid[nextx][nexty] == 1) {
                  que.push({nextx, nexty});
                  grid[nextx][nexty] = 0; // 只要加入队列立刻标记
              }
          }
      }
  }

  int main() {
      int n, m;
      cin >> n >> m;
      vector<vector<int>> grid(n, vector<int>(m, 0));
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              cin >> grid[i][j];
          }
      }
      // 从左侧边，和右侧边 向中间遍历
      for (int i = 0; i < n; i++) {
          if (grid[i][0] == 1) bfs(grid, i, 0);
          if (grid[i][m - 1] == 1) bfs(grid, i, m - 1);
      }
      // 从上边和下边 向中间遍历
      for (int j = 0; j < m; j++) {
          if (grid[0][j] == 1) bfs(grid, 0, j);
          if (grid[n - 1][j] == 1) bfs(grid, n - 1, j);
      }
      int count = 0;
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              if (grid[i][j] == 1) count++;
          }
      }

      cout << count << endl;
  }
  ```

- 参考题目
  - [101. 孤岛的总面积](https://kamacoder.com/problempage.php?pid=1173)

### 沉没孤岛

- 给定一个由 1（陆地）和 0（水）组成的矩阵，岛屿指的是由水平或垂直方向上相邻的陆地单元格组成的区域，且完全被水域单元格包围。孤岛是那些位于矩阵内部、所有单元格都不接触边缘的岛屿

- 现在需要将所有孤岛“沉没”，即将孤岛中的所有陆地单元格（1）转变为水域单元格（0）

- 从地图周边出发，将周边空格相邻的陆地都做标记，然后再遍历一遍地图，遇到陆地且没做过标记的，都是孤岛的陆地

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;
  int dir[4][2] = {-1, 0, 0, -1, 1, 0, 0, 1}; // 保存四个方向
  void dfs(vector<vector<int>>& grid, int x, int y) {
      grid[x][y] = 2;
      for (int i = 0; i < 4; i++) { // 向四个方向遍历
          int nextx = x + dir[i][0];
          int nexty = y + dir[i][1];
          // 超过边界
          if (nextx < 0 || nextx >= grid.size() || nexty < 0 || nexty >= grid[0].size()) continue;
          // 不符合条件，不继续遍历
          if (grid[nextx][nexty] == 0 || grid[nextx][nexty] == 2) continue;
          dfs (grid, nextx, nexty);
      }
      return;
  }

  int main() {
      int n, m;
      cin >> n >> m;
      vector<vector<int>> grid(n, vector<int>(m, 0));
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              cin >> grid[i][j];
          }
      }

      // 步骤一：
      // 从左侧边，和右侧边 向中间遍历
      for (int i = 0; i < n; i++) {
          if (grid[i][0] == 1) dfs(grid, i, 0);
          if (grid[i][m - 1] == 1) dfs(grid, i, m - 1);
      }

      // 从上边和下边 向中间遍历
      for (int j = 0; j < m; j++) {
          if (grid[0][j] == 1) dfs(grid, 0, j);
          if (grid[n - 1][j] == 1) dfs(grid, n - 1, j);
      }
      // 步骤二、步骤三
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              if (grid[i][j] == 1) grid[i][j] = 0;
              if (grid[i][j] == 2) grid[i][j] = 1;
          }
      }
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              cout << grid[i][j] << " ";
          }
          cout << endl;
      }
  }
  ```

- 参考题目
  - [102. 沉没孤岛](https://kamacoder.com/problempage.php?pid=1174)

### 高山流水

- 现有一个 N × M 的矩阵，每个单元格包含一个数值，这个数值代表该位置的相对高度。矩阵的左边界和上边界被认为是第一组边界，而矩阵的右边界和下边界被视为第二组边界

- 矩阵模拟了一个地形，当雨水落在上面时，水会根据地形的倾斜向低处流动，但只能从较高或等高的地点流向较低或等高并且相邻（上下左右方向）的地点。我们的目标是确定那些单元格，从这些单元格出发的水可以达到第一组边界和第二组边界

- 比较直白的想法是遍历每个点，验证该点是否能同时到达两组边界

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;
  int n, m;
  int dir[4][2] = {-1, 0, 0, -1, 1, 0, 0, 1};

  // 从 x，y 出发 把可以走的地方都标记上
  void dfs(vector<vector<int>>& grid, vector<vector<bool>>& visited, int x, int y) {
      if (visited[x][y]) return;

      visited[x][y] = true;

      for (int i = 0; i < 4; i++) {
          int nextx = x + dir[i][0];
          int nexty = y + dir[i][1];
          if (nextx < 0 || nextx >= n || nexty < 0 || nexty >= m) continue;
          if (grid[x][y] < grid[nextx][nexty]) continue; // 高度不合适

          dfs (grid, visited, nextx, nexty);
      }
      return;
  }
  bool isResult(vector<vector<int>>& grid, int x, int y) {
      vector<vector<bool>> visited(n, vector<bool>(m, false));

      // 深搜，将x,y出发 能到的节点都标记上。
      dfs(grid, visited, x, y);
      bool isFirst = false;
      bool isSecond = false;

      // 以下就是判断x，y出发，是否到达第一组边界和第二组边界
      // 第一边界的上边
      for (int j = 0; j < m; j++) {
          if (visited[0][j]) {
              isFirst = true;
              break;
          }
      }
      // 第一边界的左边
      for (int i = 0; i < n; i++) {
          if (visited[i][0]) {
              isFirst = true;
              break;
          }
      }
      // 第二边界下边
      for (int j = 0; j < m; j++) {
          if (visited[n - 1][j]) {
              isSecond = true;
              break;
          }
      }
      // 第二边界右边
      for (int i = 0; i < n; i++) {
          if (visited[i][m - 1]) {
              isSecond = true;
              break;
          }
      }
      if (isFirst && isSecond) return true;
      return false;
  }


  int main() {
      cin >> n >> m;
      vector<vector<int>> grid(n, vector<int>(m, 0));
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              cin >> grid[i][j];
          }
      }
      // 遍历每一个点，看是否能同时到达第一组边界和第二组边界
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              if (isResult(grid, i, j)) {
                  cout << i << " " << j << endl;
              }
          }
      }
  }
  ```

- 很明显，这种算法的时间复杂度为 $O(m^2*n^2)$

- 换一个思路，可以从两组边界分别逆流而上进行标记，两者都标记过的节点就是能够同时达到两组边界的节点

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;
  int n, m;
  int dir[4][2] = {-1, 0, 0, -1, 1, 0, 0, 1};
  void dfs(vector<vector<int>>& grid, vector<vector<bool>>& visited, int x, int y) {
      if (visited[x][y]) return;

      visited[x][y] = true;

      for (int i = 0; i < 4; i++) {
          int nextx = x + dir[i][0];
          int nexty = y + dir[i][1];
          if (nextx < 0 || nextx >= n || nexty < 0 || nexty >= m) continue;
          if (grid[x][y] > grid[nextx][nexty]) continue; // 注意：这里是从低向高遍历

          dfs (grid, visited, nextx, nexty);
      }
      return;
  }

  int main() {

      cin >> n >> m;
      vector<vector<int>> grid(n, vector<int>(m, 0));

      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              cin >> grid[i][j];
          }
      }
      // 标记从第一组边界上的节点出发，可以遍历的节点
      vector<vector<bool>> firstBorder(n, vector<bool>(m, false));

      // 标记从第一组边界上的节点出发，可以遍历的节点
      vector<vector<bool>> secondBorder(n, vector<bool>(m, false));

      // 从最上和最下行的节点出发，向高处遍历
      for (int i = 0; i < n; i++) {
          dfs (grid, firstBorder, i, 0); // 遍历最左列，接触第一组边界
          dfs (grid, secondBorder, i, m - 1); // 遍历最右列，接触第二组边界
      }

      // 从最左和最右列的节点出发，向高处遍历
      for (int j = 0; j < m; j++) {
          dfs (grid, firstBorder, 0, j); // 遍历最上行，接触第一组边界
          dfs (grid, secondBorder, n - 1, j); // 遍历最下行，接触第二组边界
      }
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              // 如果这个节点，从第一组边界和第二组边界出发都遍历过，就是结果
              if (firstBorder[i][j] && secondBorder[i][j]) cout << i << " " << j << endl;;
          }
      }
  }
  ```

- 参考题目
  - [103. 高山流水](https://kamacoder.com/problempage.php?pid=1175)

### 建造最大人工岛

- 给定一个由 1（陆地）和 0（水）组成的矩阵，你最多可以将矩阵中的一格水变为一块陆地，在执行了此操作之后，矩阵中最大的岛屿面积是多少

- 岛屿面积的计算方式为组成岛屿的陆地的总数。岛屿是被水包围，并且通过水平方向或垂直方向上相邻的陆地连接而成的。你可以假设矩阵外均被水包围

- 第一遍，可以先遍历地图，统计每个岛屿的编号和面积

- 第二步，遍历所有 0，并统计器相邻岛屿面积，最后取一个最大值

  ```cpp
  #include <iostream>
  #include <vector>
  #include <unordered_set>
  #include <unordered_map>
  using namespace std;
  int n, m;
  int count;

  int dir[4][2] = {0, 1, 1, 0, -1, 0, 0, -1}; // 四个方向
  void dfs(vector<vector<int>>& grid, vector<vector<bool>>& visited, int x, int y, int mark) {
      if (visited[x][y] || grid[x][y] == 0) return; // 终止条件：访问过的节点 或者 遇到海水
      visited[x][y] = true; // 标记访问过
      grid[x][y] = mark; // 给陆地标记新标签
      count++;
      for (int i = 0; i < 4; i++) {
          int nextx = x + dir[i][0];
          int nexty = y + dir[i][1];
          if (nextx < 0 || nextx >= n || nexty < 0 || nexty >= m) continue;  // 越界了，直接跳过
          dfs(grid, visited, nextx, nexty, mark);
      }
  }

  int main() {
      cin >> n >> m;
      vector<vector<int>> grid(n, vector<int>(m, 0));

      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              cin >> grid[i][j];
          }
      }
      vector<vector<bool>> visited(n, vector<bool>(m, false)); // 标记访问过的点
      unordered_map<int ,int> gridNum;
      int mark = 2; // 记录每个岛屿的编号
      bool isAllGrid = true; // 标记是否整个地图都是陆地
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              if (grid[i][j] == 0) isAllGrid = false;
              if (!visited[i][j] && grid[i][j] == 1) {
                  count = 0;
                  dfs(grid, visited, i, j, mark); // 将与其链接的陆地都标记上 true
                  gridNum[mark] = count; // 记录每一个岛屿的面积
                  mark++; // 记录下一个岛屿编号
              }
          }
      }
      if (isAllGrid) {
          cout << n * m << endl; // 如果都是陆地，返回全面积
          return 0; // 结束程序
      }

      // 以下逻辑是根据添加陆地的位置，计算周边岛屿面积之和
      int result = 0; // 记录最后结果
      unordered_set<int> visitedGrid; // 标记访问过的岛屿
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              count = 1; // 记录连接之后的岛屿数量
              visitedGrid.clear(); // 每次使用时，清空
              if (grid[i][j] == 0) {
                  for (int k = 0; k < 4; k++) {
                      int neari = i + dir[k][1]; // 计算相邻坐标
                      int nearj = j + dir[k][0];
                      if (neari < 0 || neari >= n || nearj < 0 || nearj >= m) continue;
                      if (visitedGrid.count(grid[neari][nearj])) continue; // 添加过的岛屿不要重复添加
                      // 把相邻四面的岛屿数量加起来
                      count += gridNum[grid[neari][nearj]];
                      visitedGrid.insert(grid[neari][nearj]); // 标记该岛屿已经添加过
                  }
              }
              result = max(result, count);
          }
      }
      cout << result << endl;

  }
  ```

- 参考题目
  - [104. 建造最大岛屿](https://kamacoder.com/problempage.php?pid=1176)

### 海岸线计算

- 给定一个由 1（陆地）和 0（水）组成的矩阵，岛屿是被水包围，并且通过水平方向或垂直方向上相邻的陆地连接而成的

- 你可以假设矩阵外均被水包围。在矩阵中恰好拥有一个岛屿，假设组成岛屿的陆地边长都为 1，请计算岛屿的周长。岛屿内部没有水域

- 解法一：直接遍历为 1 的陆地，根据其周围水域的数目和边界情况，直接计算周长

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n, m;
      cin >> n >> m;
      vector<vector<int>> grid(n, vector<int>(m, 0));
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              cin >> grid[i][j];
          }
      }
      int direction[4][2] = {0, 1, 1, 0, -1, 0, 0, -1};
      int result = 0;
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              if (grid[i][j] == 1) {
                  for (int k = 0; k < 4; k++) {       // 上下左右四个方向
                      int x = i + direction[k][0];
                      int y = j + direction[k][1];    // 计算周边坐标x,y
                      if (x < 0                       // x在边界上
                              || x >= grid.size()     // x在边界上
                              || y < 0                // y在边界上
                              || y >= grid[0].size()  // y在边界上
                              || grid[x][y] == 0) {   // x,y位置是水域
                          result++;
                      }
                  }
              }
          }
      }
      cout << result << endl;

  }
  ```

- 计算出总的岛屿数量，总的边数为岛屿数量 _ 4，因为有一堆相邻的两个陆地，变得总数就要减 2，因此 result = 岛屿数量 _ 4 - cover \*2

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n, m;
      cin >> n >> m;
      vector<vector<int>> grid(n, vector<int>(m, 0));
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              cin >> grid[i][j];
          }
      }
      int sum = 0;    // 陆地数量
      int cover = 0;  // 相邻数量
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < m; j++) {
              if (grid[i][j] == 1) {
                  sum++; // 统计总的陆地数量
                  // 统计上边相邻陆地
                  if(i - 1 >= 0 && grid[i - 1][j] == 1) cover++;
                  // 统计左边相邻陆地
                  if(j - 1 >= 0 && grid[i][j - 1] == 1) cover++;
                  // 为什么没统计下边和右边？ 因为避免重复计算
              }
          }
      }

      cout << sum * 4 - cover * 2 << endl;

  }
  ```

- 参考题目
  - [106. 海岸线计算](https://kamacoder.com/problempage.php?pid=1178)

## 图论的应用

### 字符串接龙

- 字典 strList 中从字符串 beginStr 和 endStr 的转换序列是一个按下述规格形成的序列：
  - 序列中第一个字符串是 beginStr
  - 序列中最后一个字符串是 endStr
  - 每次转换只能改变一个位置的字符（例如 ftr 可以转化 fty ，但 ftr 不能转化 frx）
  - 转换过程中的中间字符串必须是字典 strList 中的字符串
  - beginStr 和 endStr 不在 字典 strList 中
  - 字符串中只有小写的26个字母

- 给你两个字符串 beginStr 和 endStr 和一个字典 strList，找到从 beginStr 到 endStr 的最短转换序列中的字符串数目。如果不存在这样的转换序列，返回 0

- 可以根据 beginStr、endStr、strList 中字符串的编辑距离（编辑距离为 1）构建一个无向图，然后寻找从 beginStr 到 endStr 的最短路径；在无权重图中，用广度优先搜索求最短路最合适，广度优先搜索只要搜到了终点，那么一定是最短的路径

- 代码如下

  ```cpp
  #include <iostream>
  #include <vector>
  #include <string>
  #include <unordered_set>
  #include <unordered_map>
  #include <queue>
  using namespace std;
  int main() {
      string beginStr, endStr, str;
      int n;
      cin >> n;
      unordered_set<string> strSet;
      cin >> beginStr >> endStr;
      for (int i = 0; i < n; i++) {
          cin >> str;
          strSet.insert(str);
      }

      // 记录strSet里的字符串是否被访问过，同时记录路径长度
      unordered_map<string, int> visitMap; // <记录的字符串，路径长度>

      // 初始化队列
      queue<string> que;
      que.push(beginStr);

      // 初始化visitMap
      visitMap.insert(pair<string, int>(beginStr, 1));

      while(!que.empty()) {
          string word = que.front();
          que.pop();
          int path = visitMap[word]; // 这个字符串在路径中的长度

          // 开始在这个str中，挨个字符去替换
          for (int i = 0; i < word.size(); i++) {
              string newWord = word; // 用一个新字符串替换str，因为每次要置换一个字符

              // 遍历26的字母
              for (int j = 0 ; j < 26; j++) {
                  newWord[i] = j + 'a';
                  if (newWord == endStr) { // 发现替换字母后，字符串与终点字符串相同
                      cout <<  path + 1 << endl; // 找到了路径
                      return 0;
                  }
                  // 字符串集合里出现了newWord，并且newWord没有被访问过
                  if (strSet.find(newWord) != strSet.end()
                          && visitMap.find(newWord) == visitMap.end()) {
                      // 添加访问信息，并将新字符串放到队列中
                      visitMap.insert(pair<string, int>(newWord, path + 1));
                      que.push(newWord);
                  }
              }
          }
      }

      // 没找到输出0
      cout << 0 << endl;

  }
  ```

- 上述代码在遍历过程中动态生成可能的邻接节点，可以先预先构建好整个邻接图，然后再 BFS 遍历

  ```cpp
  #include <iostream>
  #include <vector>
  #include <string>
  #include <unordered_map>
  #include <unordered_set>
  #include <queue>
  #include <algorithm>

  using namespace std;

  class Solution {
  public:
      int ladderLength(string beginStr, string endStr, vector<string>& strList) {
          // 1. 边界检查：endStr不在字典中直接返回0
          unordered_set<string> strSet(strList.begin(), strList.end());
          if (strSet.find(endStr) == strSet.end()) {
              return 0;
          }

          int strLen = beginStr.size();
          // 2. 预构造邻接表：key=字符串，value=邻接字符串列表
          unordered_map<string, vector<string>> adjacency;

          // 构造邻接表的范围：字典所有字符串 + beginStr
          vector<string> allStrs = strList;
          allStrs.push_back(beginStr);

          for (const string& s : allStrs) {
              // 遍历每个字符位置
              for (int i = 0; i < strLen; ++i) {
                  string temp = s; // 临时字符串用于替换字符
                  // 尝试替换为26个小写字母（跳过原字符）
                  for (char c = 'a'; c <= 'z'; ++c) {
                      if (temp[i] == c) {
                          continue;
                      }
                      temp[i] = c;
                      // 若候选字符串在字典中，且未加入邻接表（避免重复）
                      if (strSet.find(temp) != strSet.end()) {
                          // 检查是否已存在（避免重复添加）
                          if (find(adjacency[s].begin(), adjacency[s].end(), temp) == adjacency[s].end()) {
                              adjacency[s].push_back(temp);
                          }
                      }
                  }
              }
          }

          // 3. BFS：完全复用邻接表
          unordered_set<string> visited; // 记录已访问的字符串
          queue<pair<string, int>> q;    // 队列：<当前字符串, 当前序列长度>
          q.push({beginStr, 1});
          visited.insert(beginStr);

          while (!q.empty()) {
              auto [currStr, currLen] = q.front();
              q.pop();

              // 直接遍历邻接表中的所有邻接节点
              for (const string& neighbor : adjacency[currStr]) {
                  // 找到目标字符串，返回长度+1
                  if (neighbor == endStr) {
                      return currLen + 1;
                  }
                  // 未访问过则入队
                  if (visited.find(neighbor) == visited.end()) {
                      visited.insert(neighbor);
                      q.push({neighbor, currLen + 1});
                  }
              }
          }

          // 无有效路径
          return 0;
      }
  };
  ```

- 单向 BFS 从 `beginStr` 向 `endStr` 单向扩散，而双向 BFS 同时从起点和终点两个方向扩散：
  - 用两个队列分别存储「起点方向」和「终点方向」的待处理字符串；
  - 用两个哈希表分别记录两个方向的访问记录（字符串 + 路径长度）；
  - 每次选择队列规模更小的一侧进行扩散（减少遍历次数）；
  - 当某个字符串同时出现在两个方向的访问记录中，说明找到了连通路径，总长度 = 起点侧长度 + 终点侧长度

- 优化后代码

  ```cpp
  #include <iostream>
  #include <vector>
  #include <string>
  #include <unordered_set>
  #include <unordered_map>
  #include <queue>
  using namespace std;

  int main() {
      string beginStr, endStr, str;
      int n;
      cin >> n;
      unordered_set<string> strSet;
      cin >> beginStr >> endStr;
      for (int i = 0; i < n; i++) {
          cin >> str;
          strSet.insert(str);
      }

      // 边界检查：终点不在字典中直接返回0
      if (strSet.find(endStr) == strSet.end()) {
          cout << 0 << endl;
          return 0;
      }

      // 双向BFS的核心结构
      queue<string> queBegin;  // 起点方向队列
      queue<string> queEnd;    // 终点方向队列
      unordered_map<string, int> visitBegin; // 起点方向访问记录
      unordered_map<string, int> visitEnd;   // 终点方向访问记录

      // 初始化
      queBegin.push(beginStr);
      visitBegin[beginStr] = 1;
      queEnd.push(endStr);
      visitEnd[endStr] = 1;

      // 双向BFS主循环
      while (!queBegin.empty() && !queEnd.empty()) {
          int result = 0;
          // 优先扩散规模更小的队列（优化：减少遍历次数）
          if (queBegin.size() <= queEnd.size()) {
              // 处理起点方向的一层
              result = bfs(queBegin, visitBegin, visitEnd, strSet);
          } else {
              // 处理终点方向的一层
              result = bfs(queEnd, visitEnd, visitBegin, strSet);
          }
          // 找到连通路径，输出结果
          if (result != 0) {
              cout << result << endl;
              return 0;
          }
      }

      // 无有效路径
      cout << 0 << endl;
      return 0;
  }

  // 封装BFS单层扩散逻辑：返回连通时的总路径长度，无连通返回0
  int bfs(queue<string>& que, unordered_map<string, int>& visitSelf,
          unordered_map<string, int>& visitOther, unordered_set<string>& strSet) {
      int size = que.size();
      // 处理当前队列的所有节点（单层扩散）
      for (int i = 0; i < size; i++) {
          string word = que.front();
          que.pop();
          int path = visitSelf[word];

          // 遍历每个字符位置，尝试替换
          for (int j = 0; j < word.size(); j++) {
              string newWord = word;
              for (char c = 'a'; c <= 'z'; c++) {
                  if (newWord[j] == c) continue; // 跳过原字符
                  newWord[j] = c;

                  // 1. 新字符串不在字典中，跳过
                  if (strSet.find(newWord) == strSet.end()) continue;

                  // 2. 新字符串在对方的访问记录中 → 找到连通路径
                  if (visitOther.find(newWord) != visitOther.end()) {
                      return path + visitOther[newWord];
                  }

                  // 3. 新字符串未被自身访问过 → 加入队列和访问记录
                  if (visitSelf.find(newWord) == visitSelf.end()) {
                      visitSelf[newWord] = path + 1;
                      que.push(newWord);
                  }
              }
          }
      }
      return 0;
  }
  ```

- 参考题目
  - [110. 字符串迁移](https://kamacoder.com/problempage.php?pid=1183)

### 有向图的完全连通

- 给定一个有向图，包含 N 个节点，节点编号分别为 1，2，...，N。现从 1 号节点开始，如果可以从 1 号节点的边可以到达任何节点，则输出 1，否则输出 -1

- 递归函数的参数
  - 传入地图 graph
  - 传入当前需要遍历哪个节点
  - 传入已经遍历过的节点状态

- 确认终止条件
  - 如果处理当前访问的节点

    ```cpp
    void dfs(const vector<list<int>>& graph, int key, vector<bool>& visited) {
        if (visited[key]) {
            return;
        }
        visited[key] = true;
        list<int> keys = graph[key];
        for (int key : keys) {
            // 深度优先搜索遍历
            dfs(graph, key, visited);
        }
    }
    ```

  - 如果处理下一次要访问的节点

    ```cpp
    void dfs(const vector<list<int>>& graph, int key, vector<bool>& visited) {
        list<int> keys = graph[key];
        for (int key : keys) {
            if (visited[key] == false) { // 确认下一个是没访问过的节点
                visited[key] = true;
                dfs(graph, key, visited);
            }
        }
    }
    ```

- 处理目前搜索结点出发的路径
  - 由于本题需要判断 1 节点是否能到达所有节点，那么就不需要进行回溯来撤销操作，只要遍历过的节点都标记上
  - 当需要搜索一条可行路径的时候，就需要进行回溯操作

- 写法一：处理当前访问的节点

  ```cpp
  #include <iostream>
  #include <vector>
  #include <list>
  using namespace std;

  void dfs(const vector<list<int>>& graph, int key, vector<bool>& visited) {
      if (visited[key]) {
          return;
      }
      visited[key] = true;
      list<int> keys = graph[key];
      for (int key : keys) {
          // 深度优先搜索遍历
          dfs(graph, key, visited);
      }
  }

  int main() {
      int n, m, s, t;
      cin >> n >> m;

      // 节点编号从1到n，所以申请 n+1 这么大的数组
      vector<list<int>> graph(n + 1); // 邻接表
      while (m--) {
          cin >> s >> t;
          // 使用邻接表 ，表示 s -> t 是相连的
          graph[s].push_back(t);
      }
      vector<bool> visited(n + 1, false);
      dfs(graph, 1, visited);
      //检查是否都访问到了
      for (int i = 1; i <= n; i++) {
          if (visited[i] == false) {
              cout << -1 << endl;
              return 0;
          }
      }
      cout << 1 << endl;
  }
  ```

- 写法二：处理下一个要访问的节点

  ```cpp
  #include <iostream>
  #include <vector>
  #include <list>
  using namespace std;

  void dfs(const vector<list<int>>& graph, int key, vector<bool>& visited) {
      list<int> keys = graph[key];
      for (int key : keys) {
          if (visited[key] == false) { // 确认下一个是没访问过的节点
              visited[key] = true;
              dfs(graph, key, visited);
          }
      }
  }

  int main() {
      int n, m, s, t;
      cin >> n >> m;

      vector<list<int>> graph(n + 1);
      while (m--) {
          cin >> s >> t;
          graph[s].push_back(t);

      }
      vector<bool> visited(n + 1, false);

      visited[1] = true; // 节点1 预先处理
      dfs(graph, 1, visited);

      for (int i = 1; i <= n; i++) {
          if (visited[i] == false) {
              cout << -1 << endl;
              return 0;
          }
      }
      cout << 1 << endl;
  }
  ```

- BFS 代码

  ```cpp
  #include <iostream>
  #include <vector>
  #include <list>
  #include <queue>
  using namespace std;

  int main() {
      int n, m, s, t;
      cin >> n >> m;

      vector<list<int>> graph(n + 1);
      while (m--) {
          cin >> s >> t;
          graph[s].push_back(t);

      }
      vector<bool> visited(n + 1, false);
      visited[1] = true; //  1 号房间开始
      queue<int> que;
      que.push(1); //  1 号房间开始

      // 广度优先搜索的过程
      while (!que.empty()) {
          int key = que.front(); que.pop();
           list<int> keys = graph[key];
           for (int key : keys) {
               if (!visited[key]) {
                   que.push(key);
                   visited[key] = true;
               }
           }
      }

      for (int i = 1; i <= n; i++) {
          if (visited[i] == false) {
              cout << -1 << endl;
              return 0;
          }
      }
      cout << 1 << endl;
  }
  ```

- 参考题目
  - [105. 有向图的完全联通](https://kamacoder.com/problempage.php?pid=1177)

### 跳跃游戏 III

- 这里有一个非负整数数组 `arr`，你最开始位于该数组的起始下标 `start` 处。当你位于下标 `i` 处时，你可以跳到 `i + arr[i]` 或者 `i - arr[i]`

- 请你判断自己是否能够跳到对应元素值为 0 的 任一 下标处

- 注意，不管是什么情况下，你都无法跳到数组之外

- 代码实现

  ```cpp
  class Solution {
  public:
      bool dfs(vector<int>& arr, vector<bool>& visited, int start) {
          if (start < 0 || start >= arr.size() || visited[start])
              return false;
          if (arr[start] == 0)
              return true;
          visited[start] = true;
          return dfs(arr, visited, start + arr[start]) ||
                 dfs(arr, visited, start - arr[start]);
      }
      bool canReach(vector<int>& arr, int start) {
          vector<bool> visited(arr.size(), false);
          return dfs(arr, visited, start);
      }
  };
  ```

- 这道题不能用并查集做，因为并查集只能处理无向连通图，而这里的跳跃是有向的，因此需要使用 DFS 来做

- 而且，这道题不用手动建图，可以直接在数组上进行跳跃

### 跳跃游戏 IV

- 给你一个整数数组 `arr` ，你一开始在数组的第一个元素处（下标为 0）

- 每一步，你可以从下标 `i` 跳到下标 `i + 1` 、`i - 1` 或者 `j` ：
  - `i + 1` 需满足：`i + 1 < arr.length`
  - `i - 1` 需满足：`i - 1 >= 0`
  - `j` 需满足：`arr[i] == arr[j]` 且 `i != j`

- 请你返回到达数组最后一个元素的下标处所需的最少操作次数

- 注意：任何时候你都不能跳到数组外面

- 显然，可以用 BFS 来求这个图上的最短路径

  ```cpp
  class Solution {
  public:
      int minJumps(vector<int>& arr) {
          int n = arr.size();
          unordered_map<int, vector<int>> same;
          for (int i = 0; i < n; i++) {
              same[arr[i]].push_back(i);
          }
          queue<int> que;
          que.push(0);
          vector<bool> visited(n, false);
          int ans = -1;
          while (!que.empty()) {
              int sze = que.size();
              ans++;
              while (sze--) {
                  int cur = que.front();
                  que.pop();
                  if (visited[cur])
                      continue;
                  visited[cur] = true;
                  if (cur == n - 1)
                      return ans;
                  if (cur - 1 >= 0)
                      que.push(cur - 1);
                  if (cur + 1 < n)
                      que.push(cur + 1);
                  for (auto next : same[arr[cur]]) {
                      que.push(next);
                  }
              }
          }
          return ans;
      }
  };
  ```

- 但是这对于某些样例会超出内存，比如前 n-1 个元素均为 7，而最后一个元素为 11，因此需要对原代码做一些优化
  - 在处理完当前节点的 same 之后，就把该元素的 same 清空掉，后面再遇到相同数字，直接跳过，不会重复入队
  - 同时也优化一下 visited 的处理逻辑

- 代码实现

  ```cpp
  class Solution {
  public:
      int minJumps(vector<int>& arr) {
          int n = arr.size();
          unordered_map<int, vector<int>> same;
          for (int i = 0; i < n; i++) {
              same[arr[i]].push_back(i);
          }
          queue<int> que;
          que.push(0);
          vector<bool> visited(n, false);
          int ans = 0;
          visited[0] = true;
          while (!que.empty()) {
              int sz = que.size();
              while (sz--) {
                  int cur = que.front();
                  que.pop();
                  if (cur == n - 1)
                      return ans;
                  for (int next : {cur - 1, cur + 1}) {
                      if (next >= 0 && next < n && !visited[next]) {
                          visited[next] = 1;
                          que.push(next);
                      }
                  }
                  for (auto next : same[arr[cur]]) {
                      if (!visited[next]) {
                          visited[next] = true;
                          que.push(next);
                      }
                  }
                  same[arr[cur]].clear();
              }
              ans++;
          }
          return ans;
      }
  };
  ```

## 并查集

### 基础知识

- 并查集（Union-Find/Disjoint Set Union, DSU）常用来解决连通性问题

- 并查集是一种高效管理元素分组的数据结构，核心解决两个问题：
  - 查找（Find）：确定某个元素属于哪个集合（找到该集合的 “代表节点”/“根节点”）
  - 合并（Union）：将两个不相交的集合合并为一个集合

- 并查集的核心思想是用树的结构表示集合：每个集合对应一棵树，树的根节点就是该集合的 “代表”；元素之间的父子关系表示 “所属” 关系（而非层级关系）

- 并查集的基础实现——用一个数组 `parent` 存储每个元素的父节点：
  - `parent[i] = i`：表示元素 `i` 是自己所在集合的根节点；
  - `parent[i] = j`：表示元素 `i` 的父节点是 `j`，需要继续向上找根

- 基础代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;

  class UnionFind {
  private:
      vector<int> parent; // 存储父节点
  public:
      // 构造函数：初始化并查集，每个元素的父节点是自己
      UnionFind(int n) {
          parent.resize(n);
          for (int i = 0; i < n; i++) {
              parent[i] = i;
          }
      }

      // 查找：找到元素x的根节点（未优化：递归/迭代）
      int find(int x) {
          // 递归版：直到找到根节点（parent[x] == x）
          if (parent[x] != x) {
              return find(parent[x]);
          }
          return x;

          // 迭代版（避免递归栈溢出）：
          // while (parent[x] != x) {
          //     x = parent[x];
          // }
          // return x;
      }

      // 合并：将元素x和y所在的集合合并
      void unite(int x, int y) {
          int rootX = find(x); // 找x的根
          int rootY = find(y); // 找y的根
          if (rootX != rootY) {
              parent[rootY] = rootX; // 将y的根挂到x的根下
          }
      }

      // 判断：x和y是否在同一个集合
      bool isSameSet(int x, int y) {
          return find(x) == find(y);
      }
  };

  // 测试示例
  int main() {
      UnionFind uf(5); // 初始化5个元素：0,1,2,3,4

      // 合并操作
      uf.unite(0, 1);
      uf.unite(1, 2);
      uf.unite(3, 4);

      // 查找&判断
      cout << "0和2是否同集合：" << (uf.isSameSet(0, 2) ? "是" : "否") << endl; // 是
      cout << "0和3是否同集合：" << (uf.isSameSet(0, 3) ? "是" : "否") << endl; // 否

      // 合并3和0的集合
      uf.unite(3, 0);
      cout << "3和2是否同集合：" << (uf.isSameSet(3, 2) ? "是" : "否") << endl; // 是

      return 0;
  }
  ```

- 基础版本的 `find` 操作在树退化成链表时，时间复杂度会变成 $O(n)$，两个核心优化能将时间复杂度降到近似 $O(1)$​（均摊复杂度）

- 优化 1：路径压缩（Find 时优化）——在查找根节点的过程中，将路径上所有节点的父节点直接指向根节点，扁平化树结构

  ```cpp
  // 带路径压缩的find（递归版，更简洁）
  int find(int x) {
      if (parent[x] != x) {
          parent[x] = find(parent[x]); // 路径压缩：直接指向根节点
      }
      return parent[x];
  }

  // 带路径压缩的find（迭代版，更高效）
  int find(int x) {
      int root = x;
      // 先找到根节点
      while (parent[root] != root) {
          root = parent[root];
      }
      // 路径压缩：将x到根的所有节点直接指向根
      while (parent[x] != root) {
          int next = parent[x];
          parent[x] = root;
          x = next;
      }
      return root;
  }
  ```

- 优化 2：按秩合并（Union 时优化）——记录每个集合的 “秩”（树的高度 / 大小），合并时将秩更小的树挂到秩更大的树下，避免树过高

  ```cpp
  class UnionFind {
  private:
      vector<int> parent;
      vector<int> rank; // 记录每个根节点的秩（树的高度）
      // 也可以用size数组：记录每个集合的元素个数，合并时小集合挂到大集合下
  public:
      UnionFind(int n) {
          parent.resize(n);
          rank.resize(n, 1); // 初始秩为1（每个集合只有自己）
          for (int i = 0; i < n; i++) {
              parent[i] = i;
          }
      }

      // 带路径压缩的find
      int find(int x) {
          if (parent[x] != x) {
              parent[x] = find(parent[x]);
          }
          return parent[x];
      }

      // 带按秩合并的unite
      void unite(int x, int y) {
          int rootX = find(x);
          int rootY = find(y);
          if (rootX == rootY) return; // 已在同一集合

          // 按秩合并：秩小的挂到秩大的下面
          if (rank[rootX] > rank[rootY]) {
              parent[rootY] = rootX;
          } else if (rank[rootX] < rank[rootY]) {
              parent[rootX] = rootY;
          } else {
              // 秩相等，合并后秩+1
              parent[rootY] = rootX;
              rank[rootX]++;
          }
      }

      bool isSameSet(int x, int y) {
          return find(x) == find(y);
      }
  };
  ```

- 并查集擅长解决 “元素分组 / 连通性” 问题，常见场景：
  - 图的连通性问题：判断图中两个节点是否连通、统计连通分量个数；
  - 动态连通性问题：比如网络节点的连接 / 断开（简化版）、朋友圈问题；
  - 克鲁斯卡尔（Kruskal）算法：求最小生成树（用并查集判断是否形成环）；
  - 解决分组问题：比如 LeetCode 的 “岛屿数量”“冗余连接”“省份数量” 等题目；
  - 字符串等价问题：比如判断多个字符串是否属于同一组（如字母异位词分组）

- 并查集的基础模板

  ```cpp
  int n = 1005; // n根据题目中节点数量而定，一般比节点数量大一点就好
  vector<int> father = vector<int> (n, 0); // C++里的一种数组结构

  // 并查集初始化
  void init() {
      for (int i = 0; i < n; ++i) {
          father[i] = i;
      }
  }
  // 并查集里寻根的过程
  int find(int u) {
      return u == father[u] ? u : father[u] = find(father[u]); // 路径压缩
  }

  // 判断 u 和 v是否找到同一个根
  bool isSame(int u, int v) {
      u = find(u);
      v = find(v);
      return u == v;
  }

  // 将v->u 这条边加入并查集
  void join(int u, int v) {
      u = find(u); // 寻找u的根
      v = find(v); // 寻找v的根
      if (u == v) return ; // 如果发现根相同，则说明在一个集合，不用两个节点相连直接返回
      father[v] = u;
  }
  ```

### 寻找存在的路径

- 给定一个包含 n 个节点的无向图中，节点编号从 1 到 n （含 1 和 n ）

- 你的任务是判断是否有一条从节点 source 出发到节点 destination 的路径存在

- 实际上，这道题目就是判断两个节点之间的连通性

- 判断一个顶点到另一个顶点有没有有效路径，其实就是判断这两个顶点是否在同一个集合里

- 而有边连在一起，就算是一个集合

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;

  int n; // 节点数量
  vector<int> father = vector<int> (101, 0); // 按照节点大小定义数组大小

  // 并查集初始化
  void init() {
      for (int i = 1; i <= n; i++)  father[i] = i;
  }
  // 并查集里寻根的过程
  int find(int u) {
      return u == father[u] ? u : father[u] = find(father[u]);
  }

  // 判断 u 和 v是否找到同一个根
  bool isSame(int u, int v) {
      u = find(u);
      v = find(v);
      return u == v;
  }

  // 将v->u 这条边加入并查集
  void join(int u, int v) {
      u = find(u); // 寻找u的根
      v = find(v); // 寻找v的根
      if (u == v) return ; // 如果发现根相同，则说明在一个集合，不用两个节点相连直接返回
      father[v] = u;
  }

  int main() {
      int m, s, t, source, destination;
      cin >> n >> m;
      init();
      while (m--) {
          cin >> s >> t;
          join(s, t);
      }
      cin >> source >> destination;
      if (isSame(source, destination)) cout << 1 << endl;
      else cout << 0 << endl;
  }
  ```

- 参考题目
  - [107. 寻找存在的路线](https://kamacoder.com/problempage.php?pid=1179)

### 多余的边

- 有一个图，它是一棵树，是拥有 n 个节点（节点编号 1 到 n ）和 n - 1 条边的连通无环无向图（其实就是一个线形图）

- 现在在这棵树上的基础上，添加一条边（依然是 n 个节点，但有 n 条边），使这个图变成了有环图

- 请找出冗余边，删除后，使其可以重新变成一棵树

- 可以从前向后遍历每一条边，每遍历一条，边上的两个节点如果不在同一个集合，就加入集合；而如果两个节点已经在同一个集合中，说明这条边就是冗余的

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;
  int n; // 节点数量
  vector<int> father(1001, 0); // 按照节点大小范围定义数组

  // 并查集初始化
  void init() {
      for (int i = 0; i <= n; ++i) {
          father[i] = i;
      }
  }
  // 并查集里寻根的过程
  int find(int u) {
      return u == father[u] ? u : father[u] = find(father[u]);
  }
  // 判断 u 和 v是否找到同一个根
  bool isSame(int u, int v) {
      u = find(u);
      v = find(v);
      return u == v;
  }
  // 将v->u 这条边加入并查集
  void join(int u, int v) {
      u = find(u); // 寻找u的根
      v = find(v); // 寻找v的根
      if (u == v) return ; // 如果发现根相同，则说明在一个集合，不用两个节点相连直接返回
      father[v] = u;
  }

  int main() {
      int s, t;
      cin >> n;
      init();
      for (int i = 0; i < n; i++) {
          cin >> s >> t;
          if (isSame(s, t)) {
              cout << s << " " << t << endl;
              return 0;
          } else {
              join(s, t);
          }
      }
  }
  ```

- 参考题目
  - [108. 多余的边](https://kamacoder.com/problempage.php?pid=1181)

### 多余的边 II

- 有一种有向树,该树只有一个根节点，所有其他节点都是该根节点的后继。该树除了根节点之外的每一个节点都有且只有一个父节点，而根节点没有父节点。有向树拥有 n 个节点和 n - 1 条边

- 现在有一个有向图，有向图是在有向树中的两个没有直接链接的节点中间添加一条有向边

- 输入一个有向图，该图由一个有着 n 个节点(节点编号 从 1 到 n)，n 条边，请返回一条可以删除的边，使得删除该条边之后该有向图可以被当作一颗有向树

- 如果是有向树，那么只有根节点入度为 0，其他节点入度都为 1（因为该树除了根节点之外的每一个节点都有且只有一个父节点，而根节点没有父节点）

- 情况一：如果找到入度为 2 的点，就应该删除一条指向该节点的边

- 情况二：如果找到入度为 2 的点，需要判断删除哪一条边，如果都可以删除，优先删除靠后的边

- 情况三：如果没有入度为 2 的点，那么图中有有向环

- 对于前两种情况，可以先统计节点的入度，并从后向前遍历，找到入度为 2 的节点所对应的边，此时要实现一个函数，判断在移除某一条边是否是有向树

- 对于第三种情况，需要找到一个有向环，也需要实现一个函数

- 至此有两个关键函数需要实现
  - `isTreeAfterRemoveEdge()` 判断删一个边之后是不是有向树——：将所有边的两端节点分别加入并查集，遇到要删除的边则跳过，如果顺利将所有边的两端节点（除了要删除的边）加入了并查集，则说明删除该条边还是一个有向树
  - `getRemoveEdge()` 确定图中一定有了有向环，那么要找到需要删除的那条边——将所有边的两端节点分别加入并查集，如果遇到即将加入并查集的边的两端节点已经在并查集中，说明构成了环

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;
  int n;
  vector<int> father (1001, 0);
  // 并查集初始化
  void init() {
      for (int i = 1; i <= n; ++i) {
          father[i] = i;
      }
  }
  // 并查集里寻根的过程
  int find(int u) {
      return u == father[u] ? u : father[u] = find(father[u]);
  }
  // 将v->u 这条边加入并查集
  void join(int u, int v) {
      u = find(u);
      v = find(v);
      if (u == v) return ;
      father[v] = u;
  }
  // 判断 u 和 v是否找到同一个根
  bool same(int u, int v) {
      u = find(u);
      v = find(v);
      return u == v;
  }

  // 在有向图里找到删除的那条边，使其变成树
  void getRemoveEdge(const vector<vector<int>>& edges) {
      init(); // 初始化并查集
      for (int i = 0; i < n; i++) { // 遍历所有的边
          if (same(edges[i][0], edges[i][1])) { // 构成有向环了，就是要删除的边
              cout << edges[i][0] << " " << edges[i][1];
              return;
          } else {
              join(edges[i][0], edges[i][1]);
          }
      }
  }

  // 删一条边之后判断是不是树
  bool isTreeAfterRemoveEdge(const vector<vector<int>>& edges, int deleteEdge) {
      init(); // 初始化并查集
      for (int i = 0; i < n; i++) {
          if (i == deleteEdge) continue;
          if (same(edges[i][0], edges[i][1])) { // 构成有向环了，一定不是树
              return false;
          }
          join(edges[i][0], edges[i][1]);
      }
      return true;
  }

  int main() {
      int s, t;
      vector<vector<int>> edges;
      cin >> n;
      vector<int> inDegree(n + 1, 0); // 记录节点入度
      for (int i = 0; i < n; i++) {
          cin >> s >> t;
          inDegree[t]++;
          edges.push_back({s, t});
      }

      vector<int> vec; // 记录入度为2的边（如果有的话就两条边）
      // 找入度为2的节点所对应的边，注意要倒序，因为优先删除最后出现的一条边
      for (int i = n - 1; i >= 0; i--) {
          if (inDegree[edges[i][1]] == 2) {
              vec.push_back(i);
          }
      }
      // 情况一、情况二
      if (vec.size() > 0) {
          // 放在vec里的边已经按照倒叙放的，所以这里就优先删vec[0]这条边
          if (isTreeAfterRemoveEdge(edges, vec[0])) {
              cout << edges[vec[0]][0] << " " << edges[vec[0]][1];
          } else {
              cout << edges[vec[1]][0] << " " << edges[vec[1]][1];
          }
          return 0;
      }

      // 处理情况三
      // 明确没有入度为2的情况，那么一定有有向环，找到构成环的边返回就可以了
      getRemoveEdge(edges);
  }
  ```

- 参考题目
  - [109. 多余的边II](https://kamacoder.com/problempage.php?pid=1182)

## 最小生成树

### Prim 算法

- 在世界的某个区域，有一些分散的神秘岛屿，每个岛屿上都有一种珍稀的资源或者宝藏。国王打算在这些岛屿上建公路，方便运输

- 不同岛屿之间，路途距离不同，国王希望你可以规划建公路的方案，如何可以以最短的总公路距离将所有岛屿联通起来

- 给定一张地图，其中包括了所有的岛屿，以及它们之间的距离。以最小化公路建设长度，确保可以链接到所有岛屿

- 这是一个最小生成树问题，最小生成树是所有节点的最小连通子图，即以最小的成本（边的权值）将图中所有节点连接到一起

- 图中有 n 个节点，那么一定可以用 n-1 条边将所有节点连接到一起，那么如何选择这 n-1 条边就是最小生成树算法的任务所在

- Prim 算法是从节点的角度采用贪心的策略每次寻找距离最小生成树最近的节点并加入到最小生成树中
  - 第一步，选距离生成树最近节点
  - 第二步，最近节点加入生成树
  - 第三步，更新非生成树节点到生成树的距离（即更新 minDist 数组）

- minDist 数组用来记录每一个节点距离最小生成树的最近距离，初始化为距离的最大数

- 在最初的时候，还没有被加入最小生成树的节点，可以随便选取一个节点

- 选取一个节点后，加入到最小生成树中，然后更新所有非生成树节点与已经生成的生成树中最新节点的距离

- 代码实现

  ```cpp
  #include<iostream>
  #include<vector>
  #include <climits>

  using namespace std;
  int main() {
      int v, e;
      int x, y, k;
      cin >> v >> e;
      // 填一个默认最大值，题目描述val最大为10000
      vector<vector<int>> grid(v + 1, vector<int>(v + 1, 10001));
      while (e--) {
          cin >> x >> y >> k;
          // 因为是双向图，所以两个方向都要填上
          grid[x][y] = k;
          grid[y][x] = k;

      }
      // 所有节点到最小生成树的最小距离
      vector<int> minDist(v + 1, 10001);

      // 这个节点是否在树里
      vector<bool> isInTree(v + 1, false);

      //加上初始化
      vector<int> parent(v + 1, -1);

      // 我们只需要循环 n-1次，建立 n - 1条边，就可以把n个节点的图连在一起
      for (int i = 1; i < v; i++) {

          // 1、prim三部曲，第一步：选距离生成树最近节点
          int cur = -1; // 选中哪个节点 加入最小生成树
          int minVal = INT_MAX;
          for (int j = 1; j <= v; j++) { // 1 - v，顶点编号，这里下标从1开始
              //  选取最小生成树节点的条件：
              //  （1）不在最小生成树里
              //  （2）距离最小生成树最近的节点
              if (!isInTree[j] &&  minDist[j] < minVal) {
                  minVal = minDist[j];
                  cur = j;
              }
          }
          // 2、prim三部曲，第二步：最近节点（cur）加入生成树
          isInTree[cur] = true;

          // 3、prim三部曲，第三步：更新非生成树节点到生成树的距离（即更新minDist数组）
          // cur节点加入之后， 最小生成树加入了新的节点，那么所有节点到 最小生成树的距离（即minDist数组）需要更新一下
          // 由于cur节点是新加入到最小生成树，那么只需要关心与 cur 相连的 非生成树节点 的距离 是否比 原来 非生成树节点到生成树节点的距离更小了呢
          for (int j = 1; j <= v; j++) {
              // 更新的条件：
              // （1）节点是 非生成树里的节点
              // （2）与cur相连的某节点的权值 比 该某节点距离最小生成树的距离小
              // 很多录友看到自己 就想不明白什么意思，其实就是 cur 是新加入 最小生成树的节点，那么 所有非生成树的节点距离生成树节点的最近距离 由于 cur的新加入，需要更新一下数据了
              if (!isInTree[j] && grid[cur][j] < minDist[j]) {
                  minDist[j] = grid[cur][j];
                  parent[j] = cur; // 记录边
              }
          }
      }
      // 统计结果
      int result = 0;
      for (int i = 2; i <= v; i++) { // 不计第一个顶点，因为统计的是边的权值，v个节点有 v-1条边
          result += minDist[i];
      }
      cout << result << endl;
      // 输出 最小生成树边的连接情况
      for (int i = 1; i <= v; i++) {
          cout << i << "->" << parent[i] << endl;
      }
  }
  ```

- 时间复杂度为 $O(n^2)$

- 上述代码只记录了最小生成树所有边的权值，那么如何打印整个最小生成树的每条边？只需要用一维数组来记录每个节点的先驱节点是什么，如 `parent[i]=j`

- 相关题目
  - [53. 寻宝（第七期模拟笔试）](https://kamacoder.com/problempage.php?pid=1053)

### Kruskal 算法

- Prim 算法是维护节点的集合，而 Kruskal 算法是维护边的集合

- Kruscal 算法的思路：
  - 将边的权值排序，因为要优先选最小的边加入到生成树里
  - 遍历排序后的边
    - 如果边首尾的两个节点在同一个集合，说明如果连上这条边图中会出现环
    - 如果边首尾的两个节点不在同一个集合，加入到最小生成树，并把两个节点加入同一个集合
  - 正好可以使用并查集来判断两个节点是否在同一个集合中

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <algorithm>

  using namespace std;

  // l,r为 边两边的节点，val为边的数值
  struct Edge {
      int l, r, val;
  };

  // 节点数量
  int n = 10001;
  // 并查集标记节点关系的数组
  vector<int> father(n, -1); // 节点编号是从1开始的，n要大一些

  // 并查集初始化
  void init() {
      for (int i = 0; i < n; ++i) {
          father[i] = i;
      }
  }

  // 并查集的查找操作
  int find(int u) {
      return u == father[u] ? u : father[u] = find(father[u]); // 路径压缩
  }

  // 并查集的加入集合
  void join(int u, int v) {
      u = find(u); // 寻找u的根
      v = find(v); // 寻找v的根
      if (u == v) return ; // 如果发现根相同，则说明在一个集合，不用两个节点相连直接返回
      father[v] = u;
  }

  int main() {

      int v, e;
      int v1, v2, val;
      vector<Edge> edges;
      int result_val = 0;
      cin >> v >> e;
      while (e--) {
          cin >> v1 >> v2 >> val;
          edges.push_back({v1, v2, val});
      }

      // 执行Kruskal算法
      // 按边的权值对边进行从小到大排序
      sort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b) {
              return a.val < b.val;
      });

      vector<Edge> result; // 存储最小生成树的边

      // 并查集初始化
      init();

      // 从头开始遍历边
      for (Edge edge : edges) {
          // 并查集，搜出两个节点的祖先
          int x = find(edge.l);
          int y = find(edge.r);

          // 如果祖先不同，则不在同一个集合
          if (x != y) {
              result.push_back(edge); // 保存最小生成树的边
              result_val += edge.val; // 这条边可以作为生成树的边
              join(x, y); // 两个节点加入到同一个集合
          }
      }
      cout << result_val << endl;

      // 打印最小生成树的边
      for (Edge edge : result) {
          cout << edge.l << " - " << edge.r << " : " << edge.val << endl;
      }

      return 0;
  }
  ```

- 时间复杂度：$O(n\log n)$ （快排） + $O(\log n)$​ （并查集）

- 使用 Kruskal 和 Prim 算法哪个更合适？
  - 如果一个图中，节点多但边相对较少，那么使用Kruskal 算法更优；因为 Kruskal 是对边进行排序的后进行操作是否加入到最小生成树，边如果少，那么遍历操作的次数就少
  - 而 Prim 算法是对节点进行操作的，节点数量越少，Prim 算法效率就越优
  - 所以在稀疏图中，用 Kruskal 更优；在稠密图中，用 Prim 算法更优

## 拓扑排序

- 某个大型软件项目的构建系统拥有 N 个文件，文件编号从 0 到 N - 1，在这些文件中，某些文件依赖于其他文件的内容，这意味着如果文件 A 依赖于文件 B，则必须在处理文件 A 之前处理文件 B （0 \<= A, B \<= N - 1）。请编写一个算法，用于确定文件处理的顺序

- 概括来说，给出一个有向图，将这个有向图转换为线性的排序，就叫做拓扑排序

- 拓扑排序也用于检测有向图是否有环，即存在循环依赖的情况，这种情况是无法做线性排序的，因此拓扑排序也是图论中判断有向无环图（DAG）的常用方法

- 实现拓扑排序的算法有两种：卡恩算法（BFS）和 DFS，这里主要讲解 BFS 算法

- 显然，在有向图中，起始节点的入度为 0，即没有边指向它，因此在做拓扑排序时，优先找入度为 0 的节点
  - 找到入度为 0 的节点，加入结果集
  - 将该结点从图中移除
  - 重复以上两个步骤，直到所有节点都在图中被移除

- 那么如何判断存在有向环？当在一次循环中，发现找不到入度为 0 的节点（也即结果集元素个数不等于图中节点个数），说明这个图中一定存在有向环

- 因为每次寻找入度为 0 的节点时，不一定只有一个节点，因此需要使用队列来维护这些入度为 0 的节点

- 每次删除节点时，需要将该节点作为出发点所连接的节点的入度减一

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <queue>
  #include <unordered_map>
  using namespace std;
  int main() {
      int m, n, s, t;
      cin >> n >> m;
      vector<int> inDegree(n, 0); // 记录每个文件的入度

      unordered_map<int, vector<int>> umap;// 记录文件依赖关系
      vector<int> result; // 记录结果

      while (m--) {
          // s->t，先有s才能有t
          cin >> s >> t;
          inDegree[t]++; // t的入度加一
          umap[s].push_back(t); // 记录s指向哪些文件
      }
      queue<int> que;
      for (int i = 0; i < n; i++) {
          // 入度为0的文件，可以作为开头，先加入队列
          if (inDegree[i] == 0) que.push(i);
          //cout << inDegree[i] << endl;
      }
      // int count = 0;
      while (que.size()) {
          int  cur = que.front(); // 当前选中的文件
          que.pop();
          //count++;
          result.push_back(cur);
          vector<int> files = umap[cur]; //获取该文件指向的文件
          if (files.size()) { // cur有后续文件
              for (int i = 0; i < files.size(); i++) {
                  inDegree[files[i]] --; // cur的指向的文件入度-1
                  if(inDegree[files[i]] == 0) que.push(files[i]);
              }
          }
      }
      if (result.size() == n) {
          for (int i = 0; i < n - 1; i++) cout << result[i] << " ";
          cout << result[n - 1];
      } else cout << -1 << endl;
  }
  ```

- 参考题目
  - [117. 软件构建](https://kamacoder.com/problempage.php?pid=1191)

## 最短路径

### dijktra

- 小明是一位科学家，他需要参加一场重要的国际科学大会，以展示自己的最新研究成果

- 小明的起点是第一个车站，终点是最后一个车站。然而，途中的各个车站之间的道路状况、交通拥堵程度以及可能的自然因素（如天气变化）等不同，这些因素都会影响每条路径的通行时间

- 小明希望能选择一条花费时间最少的路线，以确保他能够尽快到达目的地

- 最短路径问题是图论中的经典问题：给出一个有向图，一个起点，一个终点，问起点到终点的最短路径

- dijkstra 算法：在有权图（权值非负数）中求从起点到其他节点的最短路径算法
  - 第一步，选源点到哪个节点近且该节点未被访问过
  - 第二步，该最近节点被标记访问过
  - 第三步，更新非访问节点到源点的距离（即更新minDist 数组）

- minDist 数组用来记录每一个节点距离源点的最小距离，应该初始化为最大值，同时 minDist[start] = 0

- 示例代码

  ```cpp
  #include <iostream>
  #include <vector>
  #include <climits>
  using namespace std;
  int main() {
      int n, m, p1, p2, val;
      cin >> n >> m;

      vector<vector<int>> grid(n + 1, vector<int>(n + 1, INT_MAX));
      for(int i = 0; i < m; i++){
          cin >> p1 >> p2 >> val;
          grid[p1][p2] = val;
      }

      int start = 1;
      int end = n;

      // 存储从源点到每个节点的最短距离
      std::vector<int> minDist(n + 1, INT_MAX);

      // 记录顶点是否被访问过
      std::vector<bool> visited(n + 1, false);

      minDist[start] = 0;  // 起始点到自身的距离为0

      //加上初始化
      vector<int> parent(n + 1, -1);

      for (int i = 1; i <= n; i++) { // 遍历所有节点

          int minVal = INT_MAX;
          int cur = 1;

          // 1、选距离源点最近且未访问过的节点
          for (int v = 1; v <= n; ++v) {
              if (!visited[v] && minDist[v] < minVal) {
                  minVal = minDist[v];
                  cur = v;
              }
          }

          visited[cur] = true;  // 2、标记该节点已被访问

          // 3、第三步，更新非访问节点到源点的距离（即更新minDist数组）
          for (int v = 1; v <= n; v++) {
              if (!visited[v] && grid[cur][v] != INT_MAX && minDist[cur] + grid[cur][v] < minDist[v]) {
                  minDist[v] = minDist[cur] + grid[cur][v];
                  parent[v] = cur; // 记录边
              }
          }

      }

      if (minDist[end] == INT_MAX) cout << -1 << endl; // 不能到达终点
      else cout << minDist[end] << endl; // 到达终点最短路径

      // 输出最短情况
      for (int i = 1; i <= n; i++) {
          cout << parent[i] << "->" << i << endl;
      }
  }
  ```

- Dijkstra 不能处理负权边
  - Dijkstra 的思想是一旦确定一个点的最短距离，就再也不修改它
  - 它的本质是是贪心，每一步选当前距离最小的点，认定它已经是最短路径，然后不再更改
  - 而负权值可以让已经确定最短的点，后面又出现更短路径
  - 当负权值出现在已经确定的点后面，Dijkstra 将无法处理负权值带来的影响

- 对应解法
  - 有负权边 → Bellman-Ford
  - 有负权边无负环 → SPFA
  - 有负权边 + 多源 → Floyd-Warshall

- Dijkstra 算法与 Prim 算法的区别
  - Prim 是求非访问节点到最小生成树的最小距离，而 dijkstra 是求非访问节点到源点的最小距离
  - 在 Prim 中，因为 minDist 表示节点到最小生成树的最小距离，所以新节点 cur 的加入，只需要使用 `grid[cur][j]`，`grid[cur][j]` 就表示 cur 加入生成树后，生成树到节点 j 的距离
  - 因为 minDist 表示节点到源点的最小距离，所以新节点 cur 的加入，需要使用源点到 cur 的距离 (minDist[cur]) + `grid[cur][v]`（cur 到节点 v 的距离），才是源点到节点 v 的距离

- Prim算法 可以有负权值吗？可以，因为 Prim 算法只需要将节点以最小权值和连接在一起，不涉及到单一路径

### dijkstra 堆优化

- 朴素 Dijkstra 算法的时间复杂度为 $O(n^2)$​
  - 在第一个步骤中，每次找最近的节点需要遍历所有节点，时间复杂度是 $O(n)$
  - 可以用优先队列（堆）代替遍历最小值，把步骤一的时间复杂度降低至 $O(\log m)$​（m 是边数），更适合稀疏图（边数少）
  - 从边的角度出发，在第一部中，不去遍历所有节点，而是直接把带权值的边放到小顶堆中，每次聪堆顶取出的边自然就是距离源点最近的节点所在的边

- 使用邻接表存储带权图：使用一个键值对来存两个数字，一个数表示节点，一个数表示指向该节点的这条边的权值

  ```cpp
  vector<list<pair<int,int>>> grid(n + 1);

  // 使用结构体
  struct Edge {
      int to;  // 邻接顶点
      int val; // 边的权重

      Edge(int t, int w): to(t), val(w) {}  // 构造函数
  };
  ```

- 定义小顶堆

  ```cpp
  // 小顶堆
  class mycomparison {
  public:
      bool operator()(const pair<int, int>& lhs, const pair<int, int>& rhs) {
          return lhs.second > rhs.second;
      }
  };
  // 优先队列中存放 pair<节点编号，源点到该节点的权值>
  priority_queue<pair<int, int>, vector<pair<int, int>>, mycomparison> pq;

  // 取出最近的节点
  // pair<节点编号，源点到该节点的权值>
  pair<int, int> cur = pq.top(); pq.pop();
  // 第二步，该最近节点被标记访问过
  visited[cur.first] = true;
  // 第三步，更新非访问节点到源点的距离（即更新minDist数组）
  for (Edge edge : grid[cur.first]) { // 遍历 cur指向的节点，cur指向的节点为 edge
      // cur指向的节点edge.to，这条边的权值为 edge.val
      if (!visited[edge.to] && minDist[cur.first] + edge.val < minDist[edge.to]) { // 更新minDist
          minDist[edge.to] = minDist[cur.first] + edge.val;
          // 由于 cur 节点的加入，源点又有可以新连接到的边，将这些边加入到优先级队里中
          pq.push(pair<int, int>(edge.to, minDist[edge.to]));
      }
  }
  ```

- 优化版本实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <list>
  #include <queue>
  #include <climits>
  using namespace std;
  // 小顶堆
  class mycomparison {
  public:
      bool operator()(const pair<int, int>& lhs, const pair<int, int>& rhs) {
          return lhs.second > rhs.second;
      }
  };
  // 定义一个结构体来表示带权重的边
  struct Edge {
      int to;  // 邻接顶点
      int val; // 边的权重

      Edge(int t, int w): to(t), val(w) {}  // 构造函数
  };

  int main() {
      int n, m, p1, p2, val;
      cin >> n >> m;

      vector<list<Edge>> grid(n + 1);

      for(int i = 0; i < m; i++){
          cin >> p1 >> p2 >> val;
          // p1 指向 p2，权值为 val
          grid[p1].push_back(Edge(p2, val));

      }

      int start = 1;  // 起点
      int end = n;    // 终点

      // 存储从源点到每个节点的最短距离
      std::vector<int> minDist(n + 1, INT_MAX);

      // 记录顶点是否被访问过
      std::vector<bool> visited(n + 1, false);

      // 优先队列中存放 pair<节点，源点到该节点的权值>
      priority_queue<pair<int, int>, vector<pair<int, int>>, mycomparison> pq;


      // 初始化队列，源点到源点的距离为0，所以初始为0
      pq.push(pair<int, int>(start, 0));

      minDist[start] = 0;  // 起始点到自身的距离为0

      while (!pq.empty()) {
          // 1. 第一步，选源点到哪个节点近且该节点未被访问过 （通过优先级队列来实现）
          // <节点， 源点到该节点的距离>
          pair<int, int> cur = pq.top(); pq.pop();

          if (visited[cur.first]) continue;

          // 2. 第二步，该最近节点被标记访问过
          visited[cur.first] = true;

          // 3. 第三步，更新非访问节点到源点的距离（即更新minDist数组）
          for (Edge edge : grid[cur.first]) { // 遍历 cur指向的节点，cur指向的节点为 edge
              // cur指向的节点edge.to，这条边的权值为 edge.val
              if (!visited[edge.to] && minDist[cur.first] + edge.val < minDist[edge.to]) { // 更新minDist
                  minDist[edge.to] = minDist[cur.first] + edge.val;
                  pq.push(pair<int, int>(edge.to, minDist[edge.to]));
              }
          }

      }

      if (minDist[end] == INT_MAX) cout << -1 << endl; // 不能到达终点
      else cout << minDist[end] << endl; // 到达终点最短路径
  }
  ```

- 时间复杂度：$O(m\log m)$，m 为边的数量，n 为节点的数量
  - 堆的弹出操作：共弹出 $n$ 个节点，即 $O(n\log E)$
  - 堆的插入操作：共插入 E 条边，即 $O(E\log E)$
  - 由于连通图中 $n\le m+1$，因此总时间复杂度为 $O(m\log m)$
  - 在稀疏图中，$m\approx n,m\ll n^2$

- 空间复杂度：$O(n+m)$

- 参考题目
  - [47. 参加科学大会（第六期模拟笔试）](https://kamacoder.com/problempage.php?pid=1047)

### Bellman_ford

- 某国为促进城市间经济交流，决定对货物运输提供补贴。共有 n 个编号为 1 到 n 的城市，通过道路网络连接，网络中的道路仅允许从某个城市单向通行到另一个城市，不能反向通行

- 网络中的道路都有各自的运输成本和政府补贴，道路的权值计算方式为：运输成本 - 政府补贴

- 权值为正表示扣除了政府补贴后运输货物仍需支付的费用；权值为负则表示政府的补贴超过了支出的运输成本，实际表现为运输过程中还能赚取一定的收益

- 请找出从城市 1 到城市 n 的所有可能路径中，综合政府补贴后的最低运输成本

- 如果最低运输成本是一个负数，它表示在遵循最优路径的情况下，运输过程中反而能够实现盈利

- 城市 1 到城市 n 之间可能会出现没有路径的情况，同时保证道路网络中不存在任何负权回路

- 负权回路是指一系列道路的总权值为负，这样的回路使得通过反复经过回路中的道路，理论上可以无限地减少总成本或无限地增加总收益

- 松弛操作：`minDist[B] = min(minDist[A] + value, minDist[B])`

- Bellman_ford 算法采用了动态规划的思想，即：将一个问题分解成多个决策阶段，通过状态之间的递归关系最后计算出全局最优解

- Bellman_ford 算法通过对所有边进行 n-1 次松弛操作来得到最短路径

- 对所有边松弛一次，相当于计算起点到达与起点一条边相连的节点的最短距离

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <list>
  #include <climits>
  using namespace std;

  int main() {
      int n, m, p1, p2, val;
      cin >> n >> m;

      vector<vector<int>> grid;

      // 将所有边保存起来
      for(int i = 0; i < m; i++){
          cin >> p1 >> p2 >> val;
          // p1 指向 p2，权值为 val
          grid.push_back({p1, p2, val});

      }
      int start = 1;  // 起点
      int end = n;    // 终点

      vector<int> minDist(n + 1 , INT_MAX);
      minDist[start] = 0;
      for (int i = 1; i < n; i++) { // 对所有边 松弛 n-1 次
          for (vector<int> &side : grid) { // 每一次松弛，都是对所有边进行松弛
              int from = side[0]; // 边的出发点
              int to = side[1]; // 边的到达点
              int price = side[2]; // 边的权值
              // 松弛操作
              // minDist[from] != INT_MAX 防止从未计算过的节点出发
              if (minDist[from] != INT_MAX && minDist[to] > minDist[from] + price) {
                  minDist[to] = minDist[from] + price;
              }
          }
      }
      if (minDist[end] == INT_MAX) cout << "unconnected" << endl; // 不能到达终点
      else cout << minDist[end] << endl; // 到达终点最短路径
  }
  ```

- 参考题目
  - [94. 城市间货物运输 I](https://kamacoder.com/problempage.php?pid=1152)

### SPFA（Shortest Path Faster Algorithm）算法

- Bellman_ford 算法每次松弛都是对所有边进行松弛，而真正有效的松弛，是基于已经计算过的节点在做的松弛

- 因此，只需要对上一次松弛的时候更新过的节点作为出发节点所连接的边进行松弛即可

- 可以用队列来记录上次松弛的时候更新过的节点

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <queue>
  #include <list>
  #include <climits>
  using namespace std;

  struct Edge { //邻接表
      int to;  // 链接的节点
      int val; // 边的权重

      Edge(int t, int w): to(t), val(w) {}  // 构造函数
  };


  int main() {
      int n, m, p1, p2, val;
      cin >> n >> m;

      vector<list<Edge>> grid(n + 1);

      vector<bool> isInQueue(n + 1); // 加入优化，已经在队里里的元素不用重复添加

      // 将所有边保存起来
      for(int i = 0; i < m; i++){
          cin >> p1 >> p2 >> val;
          // p1 指向 p2，权值为 val
          grid[p1].push_back(Edge(p2, val));
      }
      int start = 1;  // 起点
      int end = n;    // 终点

      vector<int> minDist(n + 1 , INT_MAX);
      minDist[start] = 0;

      queue<int> que;
      que.push(start);

      while (!que.empty()) {

          int node = que.front(); que.pop();
          isInQueue[node] = false; // 从队列里取出的时候，要取消标记，我们只保证已经在队列里的元素不用重复加入
          for (Edge edge : grid[node]) {
              int from = node;
              int to = edge.to;
              int value = edge.val;
              if (minDist[to] > minDist[from] + value) { // 开始松弛
                  minDist[to] = minDist[from] + value;
                  if (isInQueue[to] == false) { // 已经在队列里的元素不用重复添加
                      que.push(to);
                      isInQueue[to] = true;
                  }
              }
          }

      }
      if (minDist[end] == INT_MAX) cout << "unconnected" << endl; // 不能到达终点
      else cout << minDist[end] << endl; // 到达终点最短路径
  }
  ```

- 如果图越稠密，则 SPFA 的效率越接近与 Bellman_ford

- 反之，图越稀疏，SPFA 的效率就越高

- SPFA 在最坏的情况下是 $O(N * E)$，但 一般情况下 时间复杂度为 $O(K * N)$

- 正权回路：有环，但环的总权值为正数

- 负权回路：有环，但环的总权值为负数

- 在有环且只有正权回路的情况下，即使元素重复加入队列，最后，也会因为所有边都松弛后，节点数值（minDist 数组）不再发生变化而终止

- 而且有重复元素加入队列是正常的，多条路径到达同一个节点，节点必然要选择一个最短的路径，而这个节点就会重复加入队列进行判断，选一个最短的

- 但如果出现了负权回路，负权回路会导致可以无限最短路径，此时每松弛一次，都会更新最短路径

- 解决负权回路，可以在已经进行了 n-1 次松弛操作之后，进行第 n 次松弛操作，如果 minDist 数组还会更新，则说明存在负权回路

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <queue>
  #include <list>
  #include <climits>
  using namespace std;

  struct Edge { //邻接表
      int to;  // 链接的节点
      int val; // 边的权重

      Edge(int t, int w): to(t), val(w) {}  // 构造函数
  };


  int main() {
      int n, m, p1, p2, val;
      cin >> n >> m;

      vector<list<Edge>> grid(n + 1); // 邻接表

      // 将所有边保存起来
      for(int i = 0; i < m; i++){
          cin >> p1 >> p2 >> val;
          // p1 指向 p2，权值为 val
          grid[p1].push_back(Edge(p2, val));
      }
      int start = 1;  // 起点
      int end = n;    // 终点

      vector<int> minDist(n + 1 , INT_MAX);
      minDist[start] = 0;

      queue<int> que;
      que.push(start); // 队列里放入起点

      vector<int> count(n+1, 0); // 记录节点加入队列几次
      count[start]++;
      vector<bool> inQueue(n+1, false);  // 记录节点是否在队列中

      bool flag = false;
      while (!que.empty()) {

          int node = que.front(); que.pop();
          inQueue[node] = false;  // 节点出队

          for (Edge edge : grid[node]) {
              int from = node;
              int to = edge.to;
              int value = edge.val;
              if (minDist[to] > minDist[from] + value) { // 开始松弛
                  minDist[to] = minDist[from] + value;
                   if (!inQueue[to]) {  // 避免重复入队
                      que.push(to);
                      inQueue[to] = true;
                      count[to]++;
                      if (count[to] == n) {// 如果加入队列次数超过 n-1次 就说明该图与负权回路
                          flag = true;
                          while (!que.empty()) que.pop();
                          break;
                      }
                   }
              }
          }
      }

      if (flag) cout << "circle" << endl;
      else if (minDist[end] == INT_MAX) {
          cout << "unconnected" << endl;
      } else {
          cout << minDist[end] << endl;
      }
  }
  ```

### Bellman_ford 单源有限最短路

- 计算在最多经过 k 个城市的条件下，从城市 src 到城市 dst 的最低运输成本

- 注意，题目要求最多经过 k 个城市的条件下，而不是一定经过 k 个城市，也可以经过的城市数量比k小，但要最短的路径

- 最多经过 k 个城市， 那么是 k + 1条边相连的节点

- 对所有边松弛 k + 1 次，就是求起点到达与起点 k + 1 条边相连的节点的最短距离

- 同时，之前在计算 minDist 数组时，基于本次松弛的 minDist 数值，而不是上一次松弛时 minDist的数值；所以在每次计算 minDist 时，要基于对所有边上一次松弛的 minDist 数值才可以，所以要记录上一次松弛的minDist

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <list>
  #include <climits>
  using namespace std;

  int main() {
      int src, dst,k ,p1, p2, val ,m , n;

      cin >> n >> m;

      vector<vector<int>> grid;

      for(int i = 0; i < m; i++){
          cin >> p1 >> p2 >> val;
          grid.push_back({p1, p2, val});
      }

      cin >> src >> dst >> k;

      vector<int> minDist(n + 1 , INT_MAX);
      minDist[src] = 0;
      vector<int> minDist_copy(n + 1); // 用来记录上一次遍历的结果
      for (int i = 1; i <= k + 1; i++) {
          minDist_copy = minDist; // 获取上一次计算的结果
          for (vector<int> &side : grid) {
              int from = side[0];
              int to = side[1];
              int price = side[2];
              // 注意使用 minDist_copy 来计算 minDist
              if (minDist_copy[from] != INT_MAX && minDist[to] > minDist_copy[from] + price) {
                  minDist[to] = minDist_copy[from] + price;
              }
          }
      }
      if (minDist[dst] == INT_MAX) cout << "unreachable" << endl; // 不能到达终点
      else cout << minDist[dst] << endl; // 到达终点最短路径

  }
  ```

- 同样的图，边的顺序不一样，使用没有缓存上一次松弛的 minDist 数组的代码，每次松弛更新的节点也是不一样的

- 为什么计算 minDist 一定要基于上次 的 minDist 数值，其关键在于本题的两个因素：
  - 本题可以有负权回路，说明只要多做松弛，结果是会变的
  - 本题要求最多经过 k 个节点，对松弛次数是有限制的

- 使用 SPFA 算法解决本题时，关键在于如何控制松弛 k 次；可以用一个变量 que_size 记录每一轮松弛入队列的所有节点数量；下一轮松弛的时候，就把队列里 que_size 个节点都弹出来，就是上一轮松弛入队列的节点；同时，每一轮松弛中，重复节点可以不用入队列，因为重复节点进入队列，下次从队列里取节点的时候，该节点要取很多次，而且都是重复计算

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <queue>
  #include <list>
  #include <climits>
  using namespace std;

  struct Edge { //邻接表
      int to;  // 链接的节点
      int val; // 边的权重

      Edge(int t, int w): to(t), val(w) {}  // 构造函数
  };


  int main() {
      int n, m, p1, p2, val;
      cin >> n >> m;

      vector<list<Edge>> grid(n + 1); // 邻接表

      // 将所有边保存起来
      for(int i = 0; i < m; i++){
          cin >> p1 >> p2 >> val;
          // p1 指向 p2，权值为 val
          grid[p1].push_back(Edge(p2, val));
      }
      int start, end, k;
      cin >> start >> end >> k;

      k++;

      vector<int> minDist(n + 1 , INT_MAX);
      vector<int> minDist_copy(n + 1); // 用来记录每一次遍历的结果

      minDist[start] = 0;

      queue<int> que;
      que.push(start); // 队列里放入起点

      int que_size;
      while (k-- && !que.empty()) {

          vector<bool> visited(n + 1, false); // 每一轮松弛中，控制节点不用重复入队列
          minDist_copy = minDist;
          que_size = que.size();
          while (que_size--) {
              int node = que.front(); que.pop();
              for (Edge edge : grid[node]) {
                  int from = node;
                  int to = edge.to;
                  int price = edge.val;
                  if (minDist[to] > minDist_copy[from] + price) {
                      minDist[to] = minDist_copy[from] + price;
                      if(visited[to]) continue; // 不用重复放入队列，但需要重复松弛，所以放在这里位置
                      visited[to] = true;
                      que.push(to);
                  }
              }

          }
      }
      if (minDist[end] == INT_MAX) cout << "unreachable" << endl;
      else cout << minDist[end] << endl;
  }
  ```

- 参考题目
  - [96. 城市间货物运输 III](https://kamacoder.com/problempage.php?pid=1154)

### Floyd

- 小明喜欢去公园散步，公园内布置了许多的景点，相互之间通过小路连接，小明希望在观看景点的同时，能够节省体力，走最短的路径

- 给定一个公园景点图，图中有 N 个景点（编号为 1 到 N），以及 M 条双向道路连接着这些景点。每条道路上行走的距离都是已知的

- 小明有 Q 个观景计划，每个计划都有一个起点 start 和一个终点 end，表示他想从景点 start 前往景点 end。由于小明希望节省体力，他想知道每个观景计划中从起点到终点的最短路径长度。 请你帮助小明计算出每个观景计划的最短路径长度

- 这是一个多源最短路问题：求多个起点到多个终点的多条最短路径

- 可以使用 Floyd 算法来解决这个问题，Floyd 算法对边的权值正负没有要求，都可以处理

- Floyd 算法核心思想是动态规划，两个节点之间的最短距离，可以由中间节点分割得到的子问题来推导得到整体最优方案

- dp 数组的含义：`grid[i][j][k] = m`，表示节点 i 到 节点 j 以 [1...k] 集合中的一个节点为中间节点的最短距离为m

- 递推公式
  - 节点 i 到 节点 j 的最短路径经过节点 k：`grid[i][j][k] = grid[i][k][k - 1] + grid[k][j][k - 1]`
    - 节点 i 到 节点k 的最短距离是不经过节点k，中间节点集合为 [1...k-1]，所以 表示为`grid[i][k][k - 1]`
    - 节点 k 到 节点 j 的最短距离 也是不经过节点 k，中间节点集合为 [1...k-1]，所以表示为 `grid[k][j][k - 1]`
  - 节点 i 到 节点 j 的最短路径不经过节点 k：`grid[i][j][k] = grid[i][j][k - 1]`
  - `grid[i][j][k] = min(grid[i][k][k - 1] + grid[k][j][k - 1]， grid[i][j][k - 1])`

- 初始化 dp 数组：`grid[i][j][0]=grid[j][i][0]=weight(i,j)`

- 遍历顺序：最外层遍历 k，i 和 j 遍历顺序没有影响

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <list>
  using namespace std;

  int main() {
      int n, m, p1, p2, val;
      cin >> n >> m;

      vector<vector<vector<int>>> grid(n + 1, vector<vector<int>>(n + 1, vector<int>(n + 1, 10005)));  // 因为边的最大距离是10^4
      for(int i = 0; i < m; i++){
          cin >> p1 >> p2 >> val;
          grid[p1][p2][0] = val;
          grid[p2][p1][0] = val; // 注意这里是双向图

      }
      // 开始 floyd
      for (int k = 1; k <= n; k++) {
          for (int i = 1; i <= n; i++) {
              for (int j = 1; j <= n; j++) {
                  grid[i][j][k] = min(grid[i][j][k-1], grid[i][k][k-1] + grid[k][j][k-1]);
              }
          }
      }
      // 输出结果
      int z, start, end;
      cin >> z;
      while (z--) {
          cin >> start >> end;
          if (grid[start][end][n] == 10005) cout << -1 << endl;
          else cout << grid[start][end][n] << endl;
      }
  }
  ```

- 空间上，只需要定义 `grid[n + 1][ n + 1][2]` 大小的数组，因为 k 只依赖于 k-1 的状态

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      int n, m, p1, p2, val;
      cin >> n >> m;

      vector<vector<int>> grid(n + 1, vector<int>(n + 1, 10005));  // 因为边的最大距离是10^4

      for(int i = 0; i < m; i++){
          cin >> p1 >> p2 >> val;
          grid[p1][p2] = val;
          grid[p2][p1] = val; // 注意这里是双向图

      }
      // 开始 floyd
      for (int k = 1; k <= n; k++) {
          for (int i = 1; i <= n; i++) {
              for (int j = 1; j <= n; j++) {
                  grid[i][j] = min(grid[i][j], grid[i][k] + grid[k][j]);
              }
          }
      }
      // 输出结果
      int z, start, end;
      cin >> z;
      while (z--) {
          cin >> start >> end;
          if (grid[start][end] == 10005) cout << -1 << endl;
          else cout << grid[start][end] << endl;
      }
  }
  ```

- 参考题目
  - [97. 小明逛公园](https://kamacoder.com/problempage.php?pid=1155)

### A\*

- 在象棋中，马和象的移动规则分别是“马走日”和“象走田”。现给定骑士的起始坐标和目标坐标，要求根据骑士的移动规则，计算从起点到达目标点所需的最短步数

- 广度优先搜索

  ```cpp
  #include<iostream>
  #include<queue>
  #include<string.h>
  using namespace std;
  int moves[1001][1001];
  int dir[8][2]={-2,-1,-2,1,-1,2,1,2,2,1,2,-1,1,-2,-1,-2};
  void bfs(int a1,int a2, int b1, int b2)
  {
  	queue<int> q;
  	q.push(a1);
  	q.push(a2);
  	while(!q.empty())
  	{
  		int m=q.front(); q.pop();
  		int n=q.front(); q.pop();
  		if(m == b1 && n == b2)
  		break;
  		for(int i=0;i<8;i++)
  		{
  			int mm=m + dir[i][0];
  			int nn=n + dir[i][1];
  			if(mm < 1 || mm > 1000 || nn < 1 || nn > 1000)
  			continue;
  			if(!moves[mm][nn])
  			{
  				moves[mm][nn]=moves[m][n]+1;
  				q.push(mm);
  				q.push(nn);
  			}
  		}
  	}
  }

  int main()
  {
      int n, a1, a2, b1, b2;
      cin >> n;
      while (n--) {
          cin >> a1 >> a2 >> b1 >> b2;
          memset(moves,0,sizeof(moves));
  		bfs(a1, a2, b1, b2);
  		cout << moves[b1][b2] << endl;
  	}
  	return 0;
  }
  ```

- 在 BFS 中，进行了很多无用的遍历，那么是否可以让遍历方向直接向终点的方向去遍历？

- A\* 算法就是一种 BFS 的改良版，也可以说是 dijkstra 的改良版

- 在搜索最短路时， 如果是无权图（边的权值都是1） 那么可以使用 BFS，代码简洁，时间效率和 dijkstra 差不多 （具体要取决于图的稠密）；而如果是有权图（边有不同的权值），优先考虑 dijkstra

- Astar 关键在于启发式函数， 也就是影响 BFS 或者 dijkstra 从容器（队列）里取元素的优先顺序

- 那么启发式函数如何影响队列里元素的排序？就需要给每一个节点权值，设每个节点的权值为 F，给出公式为：F = G + H
  - G：起点达到目前遍历节点的距离
  - H：目前遍历的节点到达终点的距离

- 起点达到目前遍历节点的距离 + 目前遍历的节点到达终点的距离就是起点到达终点的距离

- 对于无权网络，计算两点距离可以使用
  - 曼哈顿距离：$abs(x_1-x_2)+abs(y_1-y_2)$
  - 欧氏距离：$sqrt( (x_1-x_2)^2 + (y_1-y_2)^2$
  - 切比雪夫距离：$max(abs(x_1 - x_2), abs(y_1 - y_2))$

- 代码实现

  ```cpp
  #include<iostream>
  #include<queue>
  #include<string.h>
  using namespace std;
  int moves[1001][1001];
  int dir[8][2]={-2,-1,-2,1,-1,2,1,2,2,1,2,-1,1,-2,-1,-2};
  int b1, b2;
  // F = G + H
  // G = 从起点到该节点路径消耗
  // H = 该节点到终点的预估消耗

  struct Knight{
      int x,y;
      int g,h,f;
      bool operator < (const Knight & k) const{  // 重载运算符， 从小到大排序
       return k.f < f;
      }
  };

  priority_queue<Knight> que;

  int Heuristic(const Knight& k) { // 欧拉距离
      return (k.x - b1) * (k.x - b1) + (k.y - b2) * (k.y - b2); // 统一不开根号，这样可以提高精度
  }
  void astar(const Knight& k)
  {
      Knight cur, next;
  	que.push(k);
  	while(!que.empty())
  	{
  		cur=que.top(); que.pop();
  		if(cur.x == b1 && cur.y == b2)
  		break;
  		for(int i = 0; i < 8; i++)
  		{
  			next.x = cur.x + dir[i][0];
  			next.y = cur.y + dir[i][1];
  			if(next.x < 1 || next.x > 1000 || next.y < 1 || next.y > 1000)
  			continue;
  			if(!moves[next.x][next.y])
  			{
  				moves[next.x][next.y] = moves[cur.x][cur.y] + 1;

                  // 开始计算F
  				next.g = cur.g + 5; // 统一不开根号，这样可以提高精度，马走日，1 * 1 + 2 * 2 = 5
                  next.h = Heuristic(next);
                  next.f = next.g + next.h;
                  que.push(next);
  			}
  		}
  	}
  }

  int main()
  {
      int n, a1, a2;
      cin >> n;
      while (n--) {
          cin >> a1 >> a2 >> b1 >> b2;
          memset(moves,0,sizeof(moves));
          Knight start;
          start.x = a1;
          start.y = a2;
          start.g = 0;
          start.h = Heuristic(start);
          start.f = start.g + start.h;
  		astar(start);
          while(!que.empty()) que.pop(); // 队列清空
  		cout << moves[b1][b2] << endl;
  	}
  	return 0;
  }
  ```

- 最坏情况下，A* 退化成 BFS，算法的时间复杂度是 $O(n * 2)$，n 为节点数量

- 最佳情况，是从起点直接到终点，时间复杂度为 $O(d\log d)$​，d 为起点到终点的深度

- 可以非常粗略的认为 A\* 算法的时间复杂度是 $O(n\log n)$ ，n 为节点数量

- A\* 算法的空间复杂度 $O(b ^ d)$​ ,d 为起点到终点的深度，b 是图中节点间的连接数量

- 如果使用曼哈顿距离或切比雪夫距离，在网格地图中并不能体现出点到点的真正距离

- A\* 算法并不能保证一定是最短路，因为在设计启发式函数的时候，要考虑 时间效率与准确度之间的一个权衡

- 例如在游戏中，在地图很大、不同路径权值不同、有障碍 且多个游戏单位在地图中寻路的情况，如果要计算准确最短路，耗时很大，会给玩家一种卡顿的感觉

- 而真实玩家在玩游戏的时候，并不要求一定是最短路，次短路也是可以的 （玩家不一定能感受出来，及时感受出来也不是很在意），只要奔着目标走过去大体就可以接受

- 所以在游戏开发设计中，保证运行效率的情况下，A\* 算法中的启发式函数设计往往不是最短路，而是接近最短路的次短路设计

- 相对于 普通 BFS，A* 算法只从队列里取出距离终点最近的节点，而大量不需要访问的节点都会存放在队列中，造成空间的过度消耗，而 IDA* 算法针对这一问题进行了优化

- 还有一种场景是 A* 解决不了的，即如果题目中，给出多个可能的目标，然后在这多个目标中选择最近的目标，这时 A* 就不擅长了， 因为 A\* 只擅长给出明确的目标，然后找到最短路径

- 参考题目
  - [127. 骑士的攻击](https://kamacoder.com/problempage.php?pid=1203)

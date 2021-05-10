---
title: 力扣刷题笔记（定时更新）
date: 2021-05-10 14:33:56
tags: [算法,leetcode]
categories: [算法]
sticky: 1
---

# 1. 两数之和

> https://leetcode-cn.com/problems/two-sum/
>
> 难度： 简单

## 题目

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

示例 1：

```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```


示例 2：

```
输入：nums = [3,2,4], target = 6
输出：[1,2]
```

示例 3：

```
输入：nums = [3,3], target = 6
输出：[0,1]
```

## 解答

- 新建一个新数组，存放遍历过的元素；
- 遍历传入的`nums`数组，并求出对应元素与`target`的差；
- 判断差是否存在于新数组中
  - 如果存在，则返回结果
  - 如果不存在，这将该元素`push`到新数组中，并继续遍历

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const arr = [nums[0]];      // 新建一个数组，并将nums第一个元素放入
    for(let i = 1; i < nums.length; i++) {    // 遍历nums其他元素
        const diff = target - nums[i];     // 求差
        if(arr.indexOf(diff) !== -1){      // 判断差是否在数组内，true的话返回结果，false的话将该元素放入新数组中
            return [arr.indexOf(diff), i]
        };
        arr.push(nums[i])
    }
};
```

- 复杂度
  - 时间复杂度：`O(N)`，其中`N`是数组中的元素数量。对于每一个元素`x`，我们可以`O(1)`地寻找`target - x`。
  - 空间复杂度：`O(N)`，其中`N`是数组中的元素数量。

# 2. 两数相加

> https://leetcode-cn.com/problems/add-two-numbers/
>
> 难度： 中等

## 题目

给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照**逆序**的方式存储的，并且每个节点只能存储**一位**数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

示例 1：

![addtwonumber1](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2021/01/02/addtwonumber1.jpg)

```
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.
```


示例 2：

```
输入：l1 = [0], l2 = [0]
输出：[0]
```

示例 3：

```
输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
输出：[8,9,9,9,0,0,0,1]
```

## 解答

- 由于输入的两个链表都是**逆序**存储数字的位数的，因此两个链表中同一位置的数字可以直接相加；
- 我们同时遍历两个链表，逐位计算它们的和，并与当前位置的进位值相加；
  - 如果两个链表的长度不同，则可以认为长度短的链表的后面有若干个0
- 链表遍历结束后，有`carry>0`，还需要在答案链表的后面附加一个节点，节点的值为`carry`。


```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    let head = null;  // 保存链表头
    let tail = null;
    let carry = 0;    // 进位值
    while(l1 || l2){
      	// 获取节点的值
        const n1 = l1 ? l1.val : 0;   
        const n2 = l2 ? l2.val : 0;
      
        const sum = n1 + n2 + carry;  // 求和
        if(!head) {
            head = tail = new ListNode(sum % 10);
        } else {
            tail.next = new ListNode(sum % 10);
            tail = tail.next;
        }
        carry = Math.floor(sum / 10);   // 保存进位
        l1 ? l1 = l1.next : '';
        l2 ? l2 = l2.next : '';
    }
  
    if(carry > 0){
        tail.next = new ListNode(carry);
    }
  
    return head;
};
```

- 复杂度
  - 时间复杂度：`O(max(m,n))`，其中 `m` 和 `n` 分别为两个链表的长度。我们要遍历两个链表的全部位置，而处理每个位置只需要 `O(1)`的时间。
  - 空间复杂度：`O(1)`。注意返回值不计入空间复杂度。

# 3. 无重复字符的最长子串

> https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/
>
> 难度： 中等

## 题目

给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。

示例 1:

```
输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

示例 2:

```
输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```


示例 3:

```
输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```


示例 4:

```
输入: s = ""
输出: 0
```

## 解答

- 用双指针维护一个滑动窗口，用来剪切子串；
- 不断移动右指针，知道遇到重复字符的时候把左指针移到前面的重复字符的下一位；
- 移动指针过程中，记录窗口长度的最大值即为答案

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
    let leftPoint = -1;      // 定义左指针
    let res = 0;            // 结果
    let map = new Map();   // 存放字符和对应下标
    for(let rightPoint = 0; rightPoint < s.length; rightPoint++){
        // 如果出现了重复的字符串，则将左指针移到重复字符的下一位，注意同时满足重复字符的索引大于左指针
        if(map.has(s[rightPoint]) && map.get(s[rightPoint]) >= leftPoint){
            leftPoint = map.get(s[rightPoint]);
        }

        res = Math.max(res, rightPoint - leftPoint);
        map.set(s[rightPoint], rightPoint)
    }
    return res;
};
```

- 复杂度
  - 时间复杂度：`O(N)`，其中`N`是字符串的长度，左指针会遍历整个字符串一次；
  - 空间复杂度：`O(∣Σ∣)`，其中 `Σ `表示字符集（即字符串中可以出现的字符），`∣Σ∣ `表示字符集的大小。在本题中没有明确说明字符集，因此可以默认为所有 ASCII 码在 [0,128) 内的字符，即`∣Σ∣=128`。我们需要用到哈希集合来存储出现过的字符，而字符最多有`∣Σ∣ `个，因此空间复杂度为` O(∣Σ∣)`。

# 4. 寻找两个正序数组的中位数

> https://leetcode-cn.com/problems/median-of-two-sorted-arrays/
>
> 难度：困难

## 题目

给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。 

示例 1：

```
输入：nums1 = [1,3], nums2 = [2]
输出：2.00000
解释：合并数组 = [1,2,3] ，中位数 2
```

示例 2：

```
输入：nums1 = [1,2], nums2 = [3,4]
输出：2.50000
解释：合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5
```

示例 3：

```
输入：nums1 = [0,0], nums2 = [0,0]
输出：0.00000
```

示例 4：

```
输入：nums1 = [], nums2 = [1]
输出：1.00000
```

示例 5：

```
输入：nums1 = [2], nums2 = []
输出：2.00000
```

**进阶：**你能设计一个时间复杂度为 `O(log (m+n))` 的算法解决此问题吗？

## 解法

### 最简单实现

- 合并数组
- `sort`排序
- 找出中位数

```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    const nums = [...nums1, ...nums2];
    nums.sort((a,b) => a - b);
  
  	return nums.length % 2 ? 
      nums[(nums.length - 1) / 2] : 
    	(nums[nums.length / 2 ] + nums[nums.length / 2 - 1]) / 2
};
```

- 复杂度
  - 时间复杂度：`O((m+n)log(m+n))`
  - 空间复杂度：`O(m+n)`

- 缺点
  - `sort`使用的是插入排序和快速排序结合的排序算法。数组长度不超过10时，使用插入排序。长度超过10使用快速排序；
  - `nums1`和`nums2`都是正序数组，合并后再进行排序会显得多此一举，增加了时间复杂度。

### 暴力解法 （Brute Force）

- 用两个指针标记两个数组，初始位置都在数组的起始位置；
- 然后从起始位置开始，两个数组的元素一一比较，小的元素`push`到合并数组中；
- 直至其中一个数组结束后，将另一个数组剩余元素`push`到合并数组中；
- 求出合并数组的中位数

```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    // 归并排序
  	const merge = [];
  	let i = 0 , j = 0;  // 两个数组的指针
  	while(i < nums1.length && j < nums2.length) {
      	if(nums1[i] < nums2[j]){
          	merge.push(nums1[i++])
        }else{
          	merge.push(nums2[j++])
        }
    }
  	while(i < nums1.length){
      	merge.push(nums1[i++])
    }
  	while(j < nums2.length){
      	merge.push(nums2[j++])
    }
  	
  	const { length } = merge
    return length % 2 ? 
      	merge[Math.floor(length / 2)] : 
      	(merge[length / 2] + merge[length / 2 - 1]) / 2
};
```

复杂度

- 时间复杂度：`O(m+n)`
- 空间复杂度：`O(m+n)`

### 二分查找（Binary Search）

- 先判断两个数组的长度，以较短的数组的中点为起点位置（向下取整），则为`i`指针的起始位置；
- 而`j`指针需要为`i`指针满足一个硬性条件，即`2(i + j) - (len1 + len2) <= 1`，也就是对两个指针做二分（partition）后，两个数组左边的元素之和与右边的元素之和相差不超过1；
- 然后依次对两个指针左右两个元素，即`maxLeftA``minRightB`、`maxLeftB`、`minRightA`
  - 当满足`maxLeftA <= minRightB && maxLeftB <= minRightA`的时候，返回中位数；
  - 当满足`maxLeftA > minRightB`时，`i--`;
  - 当满足`maxLeftA < minRightB`时，`i++`;

![image.png](https://pic.leetcode-cn.com/1c2093328c4edf06e416d0f43a94ed42b5a46ecc9f7ed72004b40b9fb47e12a4-image.png)


```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    // 保证nums1是最短的一个数组
    if(nums1.length > nums2.length){
        [nums1, nums2] = [nums2, nums1];
    }

    const len1 = nums1.length;
    const len2 = nums2.length;

    // 初始值为nums1中心
    let i = Math.floor(len1 / 2);
    // 确保 2(i + j) - (len1 + len2) <= 1 
    let j = Math.ceil((len1 + len2) / 2) - i;

    while(0 <= i <= len1 || 0 <= j <= len2){
        const maxLeftA = i === 0 ? -Infinity : nums1[i - 1];
        const minRightA = i === len1 ? Infinity : nums1[i];
        const maxLeftB = j === 0 ? -Infinity : nums2[j - 1];
        const minRightB = j === len2 ? Infinity : nums2[j];

        if(maxLeftA <= minRightB && maxLeftB <= minRightA){
            return  (len1 + len2) % 2 ?
                Math.max(maxLeftA, maxLeftB) :
                (Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2
        }else if(maxLeftA > minRightB){
            i--;
        }else{
            i++;
        }

        j = Math.ceil((len1 + len2) / 2) - i;
    }
};
```

- 复杂度
  - 时间复杂度：`O(log(min(m, n))`
  - 空间复杂度：`O(1)`

# 5. 最长回文子串

> https://leetcode-cn.com/problems/longest-palindromic-substring/
>
> 难度：中等

## 题目

给你一个字符串 s，找到 s 中最长的回文子串。

示例 1：

```
输入：s = "babad"
输出："bab"
解释："aba" 同样是符合题意的答案。
```

示例 2：

```
输入：s = "cbbd"
输出："bb"
```

示例 3：

```
输入：s = "a"
输出："a"
```

示例 4：

```
输入：s = "ac"
输出："a"
```

## 解法

### 中心扩展法

- 遍历字符串，对每个遍历元素作为回文子串的中心点，进行扩展判断

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    if(s.length < 2) {
        return s;
    }

    let res = '';
    for(let i = 0; i < s.length; i++){
        // 回文子串长度是奇数
        helper(i, i);
        // 回文子串长度是偶数
        helper(i, i + 1);
    }

    function helper(m, n) {
        while (m >= 0 && n < s.length && s[m] == s[n]) {
            m--;
            n++;
        }
        // 注意此处m,n的值循环完后  是恰好不满足循环条件的时刻
        // 此时m到n的距离为n-m+1，但是mn两个边界不能取 所以应该取m+1到n-1的区间  长度是n-m-1
        if (n - m - 1 > res.length) {
            // slice也要取[m+1,n-1]这个区间 
            res = s.slice(m + 1, n)
        }
    };

    return res;
};
```

- 复杂度
  - 时间复杂度：`O(N)`
  - 空间复杂度：`O(1)`

# 6. Z 字形变换

> https://leetcode-cn.com/problems/zigzag-conversion/
>
> 难度：中等

## 题目

将一个给定字符串 s 根据给定的行数 numRows ，以从上往下、从左到右进行 Z 字形排列。

比如输入字符串为 "PAYPALISHIRING" 行数为 3 时，排列如下：

```
P   A   H   N
A P L S I I G
Y   I   R
```

之后，你的输出需要从左往右逐行读取，产生出一个新的字符串，比如："PAHNAPLSIIGYIR"。

请你实现这个将字符串进行指定行数变换的函数：

```
string convert(string s, int numRows);
```


示例 1：

```
输入：s = "PAYPALISHIRING", numRows = 3
输出："PAHNAPLSIIGYIR"
```

示例 2：

```
输入：s = "PAYPALISHIRING", numRows = 4
输出："PINALSIGYAHRPI"
解释：
P     I    N
A   L S  I G
Y A   H R
P     I
```

示例 3：

```
输入：s = "A", numRows = 1
输出："A"
```



## 解题

- 先新建一个`numRows`长度的数组，每个元素初始值都为空字符串
- 遍历字符串，Z字型填充每个数组的元素

```javascript
var convert = function(s, numRows) {
    if(numRows === 1){
        return s
    }

    const arr = Array(numRows).fill('');
    let i = 0;   // 数组下标
    let isUp = false;    // 判断是向上填充还是向下填充
    for(const letter of s){
        arr[i] += letter;  // 在对应数组元素填充新的字母
        i === 0 || i === numRows - 1 ? isUp = !isUp : '';   // 触底反弹
        isUp ? i++ : i--; 
    }

    return arr.join('')
};
```

- 复杂度
  - 时间复杂度：`O(N)`，`N`为`s`的长度
  - 空间复杂度：`O(N)`，`N`为`numRows`

# 7. 整数翻转

> https://leetcode-cn.com/problems/reverse-integer/
>
> 难度：简单

## 题目

给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。

如果反转后整数超过 32 位的有符号整数的范围 [−231,  231 − 1] ，就返回 0。

假设环境不允许存储 64 位整数（有符号或无符号）。


示例 1：

```
输入：x = 123
输出：321
```

示例 2：

```
输入：x = -123
输出：-321
```

示例 3：

```
输入：x = 120
输出：21
```

示例 4：

```
输入：x = 0
输出：0
```

## 解题

- 遍历数值，获取每一位的数值，与上一次保存的数值乘以10相加

```javascript
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
    let rev = 0;
    while (x !== 0) {
        rev = rev * 10 + x % 10;
        x = ~~(x / 10);   // 进位，取整，保留符号
        if (rev < Math.pow(-2, 31) || rev > Math.pow(2, 31) - 1) {
            return 0;
        }
    }
    return rev;
};
```

- 复杂度
  - 时间复杂度：`O(log|x|)`，翻转的次数即 `x`十进制的位数。
  - 空间复杂度：`O(1)`

# 8. 字符串转换整数 (atoi)

> https://leetcode-cn.com/problems/string-to-integer-atoi/
>
> 难度：中等

## 题目

请你来实现一个 myAtoi(string s) 函数，使其能将字符串转换成一个 32 位有符号整数（类似 C/C++ 中的 atoi 函数）。

函数 myAtoi(string s) 的算法如下：

读入字符串并丢弃无用的前导空格
检查下一个字符（假设还未到字符末尾）为正还是负号，读取该字符（如果有）。 确定最终结果是负数还是正数。 如果两者都不存在，则假定结果为正。
读入下一个字符，直到到达下一个非数字字符或到达输入的结尾。字符串的其余部分将被忽略。
将前面步骤读入的这些数字转换为整数（即，"123" -> 123， "0032" -> 32）。如果没有读入数字，则整数为 0 。必要时更改符号（从步骤 2 开始）。
如果整数数超过 32 位有符号整数范围 [−2^31,  2^31 − 1] ，需要截断这个整数，使其保持在这个范围内。具体来说，小于 −2^31 的整数应该被固定为 −2^31 ，大于 2^31 − 1 的整数应该被固定为 2^31 − 1 。
返回整数作为最终结果。
注意：

本题中的空白字符只包括空格字符 ' ' 。
除前导空格或数字后的其余字符串外，请勿忽略 任何其他字符。


示例 1：

```
输入：s = "42"
输出：42
解释：加粗的字符串为已经读入的字符，插入符号是当前读取的字符。
第 1 步："42"（当前没有读入字符，因为没有前导空格）
         ^
第 2 步："42"（当前没有读入字符，因为这里不存在 '-' 或者 '+'）
         ^
第 3 步："42"（读入 "42"）
           ^
解析得到整数 42 。
由于 "42" 在范围 [-2^31, 2^31 - 1] 内，最终结果为 42 。
```

示例 2：

```
输入：s = "   -42"
输出：-42
解释：
第 1 步："   -42"（读入前导空格，但忽视掉）
            ^
第 2 步："   -42"（读入 '-' 字符，所以结果应该是负数）
             ^
第 3 步："   -42"（读入 "42"）
               ^
解析得到整数 -42 。
由于 "-42" 在范围 [-2^31, 2^31 - 1] 内，最终结果为 -42 。
```

示例 3：

```
输入：s = "4193 with words"
输出：4193
解释：
第 1 步："4193 with words"（当前没有读入字符，因为没有前导空格）
         ^
第 2 步："4193 with words"（当前没有读入字符，因为这里不存在 '-' 或者 '+'）
         ^
第 3 步："4193 with words"（读入 "4193"；由于下一个字符不是一个数字，所以读入停止）
             ^
解析得到整数 4193 。
由于 "4193" 在范围 [-2^31, 2^31 - 1] 内，最终结果为 4193 。
```

示例 4：

```
输入：s = "words and 987"
输出：0
解释：
第 1 步："words and 987"（当前没有读入字符，因为没有前导空格）
         ^
第 2 步："words and 987"（当前没有读入字符，因为这里不存在 '-' 或者 '+'）
         ^
第 3 步："words and 987"（由于当前字符 'w' 不是一个数字，所以读入停止）
         ^
解析得到整数 0 ，因为没有读入任何数字。
由于 0 在范围 [-2^31, 2^31 - 1] 内，最终结果为 0 。
```

示例 5：

```
输入：s = "-91283472332"
输出：-2147483648
解释：
第 1 步："-91283472332"（当前没有读入字符，因为没有前导空格）
         ^
第 2 步："-91283472332"（读入 '-' 字符，所以结果应该是负数）
          ^
第 3 步："-91283472332"（读入 "91283472332"）
                     ^
解析得到整数 -91283472332 。
由于 -91283472332 小于范围 [-2^31, 2^31 - 1] 的下界，最终结果被截断为 -2^31 = -2147483648 。
```

## 解题

### parseInt()

- 利用`JavaScript`自带`API` —— `parseInt()`实现。

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function(s) {
    const number = parseInt(s, 10);
    const maxNum = Math.pow(2, 31) - 1;
    const minNum = Math.pow(-2, 31);

    if(isNaN(number)) {
        return 0;
    } else if (number < minNum || number > maxNum) {
        return number < minNum ? minNum : maxNum;
    } else {
        return number;
    }
};
```

- 复杂度
  - 时间复杂度：`O(1)`
  - 空间复杂度：`O(1)`

### 自动机

- 将整个流程分为四种状态

  - 空格字符
  - 正负符号
  - 字符串型的数值
  - 其他情况

- 阶段分析

  - 如果想要将字符串转换为整数，那么必须经历这四个有序的阶段：
    - 开始转换（start）
    - 判断正负（signed）
    - 生成数值（in_number）
    - 结束转换（end）

- 生成自动机

  ![0ee783ff33682169033d26832e12619ef5186cff4ec46fa7449ab548b458fb56-1585925170(1)](https://pic.leetcode-cn.com/0ee783ff33682169033d26832e12619ef5186cff4ec46fa7449ab548b458fb56-1585925170(1).png)

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function(s) {
    // 自动机类
    class AutoMaton {
        constructor(){
            // 执行阶段，默认处于看是执行阶段
            this.state = 'start';
            // 正负符号，默认是整数
            this.sign = 1;
            // 数值，默认为0
            this.result = 0;
            /**
             * 关键点：
             *  状态和执行阶段的对应表
             * 
             * 含义如下：
             *  [执行阶段, [空格, 正负, 数值, 其他]]
            */
            this.map = new Map([
                ['start', ['start','signed','in_number','end']],
                ['signed', ['end', 'end', 'in_number', 'end']],
                ['in_number', ['end', 'end', 'in_number', 'end']],
                ['end', ['end', 'end', 'end', 'end']]
            ])
        }

        // 获取状态的索引
        getIndex(char){
            if(char === ' '){
                // 空格判断
                return 0;
            }else if(char === '+' || char === '-'){
                // 正负值判断
                return 1;
            }else if(!isNaN(Number(char))){
                // 数值判断
                return 2;
            }else{
                // 其他情况
                return 3;
            }
        }

        // 字符转换执行函数
        get(char){
          	if(this.state !== 'end'){
              	// 每次传入字符时，都要变更自动机的执行状态
            		this.state = this.map.get(this.state)[this.getIndex(char)];

            		if(this.state === 'in_number'){
               			// 在JS中，对字符串类型进行减法运算，可以得到一个数值型的值
                		this.result = this.result * 10 + (char - 0);

                		// 结果大小判断
                		this.result = this.sign === 1 ? Math.min(this.result, Math.pow(2,31) - 1) : Math.min(this.result, -1 * Math.pow(-2,31))
            		}else if(this.state === 'signed'){
                		this.sign = char === '+' ? 1 : -1;
            		}
            }
        }
    }

    // 创建自动机实例
    let automaton = new AutoMaton();

    for(let char of s) {
        automaton.get(char)
    }

    return automaton.sign * automaton.result;
}
```

- 复杂度
  - 时间复杂度：`O(N)`，其中`N`为字符串的长度
  - 空间复杂度：`O(1)`
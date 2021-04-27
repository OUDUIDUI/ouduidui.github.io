---
title: Linux MongoDB定时备份
date: 2020-12-24 18:20:25
tags: [mongodb,linux,crontab]
categories: [mongodb]
---

前段时间，我个人的服务器数据库莫名其妙就被删了，得知情况的我泪流满面。

后来我搜了很多关于恢复数据库的资料，但是基本都是依赖备份去恢复的，而身为小白的我却没有定时备份我的数据库。

幸亏我的数据库里面的数据还不算多，就打算从头开始。

经过这次疼痛的教训，当时我第一件事就是给我的服务器上一个定时备份的脚本，毕竟不能再同一个地方摔两次嘛。

顺便写个博客记录一下，以防以后还需要用到。

# 创建备份目录

```shell
# 临时备份文件夹
mkdir -p /home/mongodb_bak/mongodb_bak_now
# 备份压缩包文件夹
mkdir -p /home/mongodb_bak/mongodb_bak_list
```

# 创建备份脚本

```shell
vim /home/crontab/MongoDB_bak.sh
```

```shell
#!/bin/sh
# dump 命令执行路径，根据mongodb安装路径而定
DUMP=/usr/bin/mongodump
# 临时备份路径
OUT_DIR=/home/backup/mongod_bak/mongod_bak_now
# 压缩后的备份存放路径
TAR_DIR=/home/backup/mongod_bak/mongod_bak_list
# 当前系统时间
DATE=`date +%Y-%m-%d`
# 数据库账号
DB_USER=username
# 数据库密码
DB_PASS=password
# 代表删除7天前的备份，即只保留近 7 天的备份
DAYS=7
# 最终保存的数据库备份文件
TAR_BAK="mongod_bak_$DATE.tar.gz"

cd $OUT_DIR
rm -rf $OUT_DIR/*
mkdir -p $OUT_DIR/$DATE
$DUMP -h 127.0.0.1:27017 -u $DB_USER -p $DB_PASS --authenticationDatabase admin -o $OUT_DIR/$DATE
# 压缩格式为 .tar.gz 格式
tar -zcvf $TAR_DIR/$TAR_BAK $OUT_DIR/$DATE
# 删除 15 天前的备份文件
find $TAR_DIR/ -mtime +$DAYS -delete

exit
```

将`DB_USER` 改为你的数据库账号，`DB_PASS` 改为你的数据库密码。

# 修改脚本权限

```shell
chmod +x /home/crontab/MongoDB_bak.sh
```

# 添加计划任务

```shell
vi /etc/crontab
```

添加一下内容：

```shell
# 每周六18：30进行备份
30 18 * * 6 root /home/crontab/MongoDB_bak.sh
```

第一个数值代表分钟，第二个代表小时，第三个代表日期，第四个代表月份，第五个代表星期。

```shell
# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name  command to be executed
```

保存后脚本生效。

# 数据库恢复

```shell
#恢复全部数据库
mongorestore -u <数据库账号> -p <数据库密码> --authenticationDatabase "admin" --noIndexRestore --dir <备份文件夹路径>
#恢复单个数据库
mongorestore -u <数据库账号> -p <数据库密码> --authenticationDatabase "admin" --noIndexRestore -d <数据库名> --dir <备份文件路径>
```




-- *
-- * サンプルテーブル作成スクリプト
-- *

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id                   INT            AUTO_INCREMENT,                              -- ユーザID
    account              VARCHAR(20)    DEFAULT ''                    NOT NULL,      -- ユーザアカウント
    passward             VARCHAR(20)    DEFAULT ''                    NOT NULL,      -- パスワード
    name                 VARCHAR(20)    DEFAULT ''                    NOT NULL,      -- ユーザ名
    email                VARCHAR(20)    DEFAULT ''                    NOT NULL,      -- Eメール
    created_at           TIMESTAMP      DEFAULT CURRENT_TIMESTAMP     NOT NULL,      -- 登録日時
    PRIMARY KEY          (id),
    UNIQUE               (account)
) ENGINE=innodb;

-- ユーザ作成
grant all privileges on testdb.* to testuser@localhost identified by 'test';

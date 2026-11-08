-- ต้องสร้างตาราง customer ตามบทที่ 8 หัวข้อ 8.1 ก่อน
CREATE TABLE `orders` (
  `OrderID` int NOT NULL AUTO_INCREMENT,
  `CustomerID` varchar(4) NOT NULL,
  `Total` double NOT NULL,
  PRIMARY KEY (`OrderID`),
  KEY `fk_orders_customer` (`CustomerID`),
  CONSTRAINT `fk_orders_customer` FOREIGN KEY (`CustomerID`)
    REFERENCES `customer` (`CustomerID`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

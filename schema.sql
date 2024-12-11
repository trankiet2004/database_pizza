CREATE DATABASE restaurant;
USE restaurant;
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL, 
    phone VARCHAR(20) UNIQUE, 
    email VARCHAR(255) UNIQUE, 
    order_date DATE ,
    ordered_items TEXT,
    review TEXT,
    employee_id VARCHAR(20), 
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE employees (
    employee_id VARCHAR(20) PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    birth_date DATE,
    manager_id VARCHAR(20), 
    chef_flag BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
INSERT INTO employees (name, phone, birth_date, username, password, chef_flag)
VALUES ('Lê B', '123456789', '1985-03-12', 'clone1', '123do', FALSE);

DELIMITER $$

CREATE TRIGGER insert_employees
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    SELECT COALESCE(MAX(CAST(SUBSTRING(employee_id, 4) AS UNSIGNED)), 0) + 1 INTO next_id
    FROM employees;
    SET NEW.employee_id = CONCAT('EMP', LPAD(next_id, 5, '0'));
END$$

DELIMITER ;





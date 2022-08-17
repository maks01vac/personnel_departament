CREATE DATABASE personnel_department;


CREATE TABLE employees(
    id SERIAL PRIMARY KEY,
    firstname CHARACTER VARYING(30) NOT NULL,
    lastname CHARACTER VARYING(30) NOT NULL,
    sex CHARACTER VARYING(15) NOT NULL,
    birthdate DATE NOT NULL,
    phone CHARACTER VARYING(20) NOT NULL
);

CREATE TABLE department(
    id SERIAL PRIMARY KEY,
    name CHARACTER VARYING(30) NOT NULL,
    id_director INTEGER REFERENCES employees (id)
);

CREATE TABLE employee_department(
    id_employee INTEGER REFERENCES employees (id),
    id_department INTEGER REFERENCES department (id),
    PRIMARY KEY (id_employee, id_department)
);

CREATE TABLE employee_department_history(
    date_from DATE NOT NULL,
    date_to DATE,
    id_employee INTEGER REFERENCES employees (id),
    id_department INTEGER REFERENCES department (id),
    PRIMARY KEY (date_from,date_to, id_employee, id_department)
);


CREATE TABLE position(
    id SERIAL PRIMARY KEY,
    name CHARACTER VARYING(30)
);

CREATE TABLE employee_position(
    id_employee INTEGER REFERENCES employees (id),
    id_position INTEGER REFERENCES position (id),
    PRIMARY KEY (id_employee, id_position)
);

CREATE TABLE employee_position_history(
    date_from DATE NOT NULL,
    date_to DATE,
    id_employee INTEGER REFERENCES employees (id),
    id_position INTEGER REFERENCES position (id),
    PRIMARY KEY (date_from,date_to, id_employee, id_position)
);



CREATE TABLE employee_salary(
    id_employee INTEGER PRIMARY KEY REFERENCES employees (id),
    salary NUMERIC(10,2) NOT NULL
);

CREATE TABLE employee_salary_history(
    date_from DATE NOT NULL,
    date_to DATE,
    salary NUMERIC(10,2) NOT NULL, 
    id_employee INTEGER REFERENCES employees (id),
    PRIMARY KEY (date_from,date_to, id_employee, salary)
);
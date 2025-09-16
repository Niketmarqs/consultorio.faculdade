CREATE DATABASE consultorio;

USE consultorio;

CREATE TABLE pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(100)
);

CREATE TABLE consultas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT,
  data DATE,
  hora TIME,
  procedimento VARCHAR(100),
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);

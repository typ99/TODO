/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const mysql = require('mysql');
const { hashPassword, generateToken } = require('../utils');

class Database {
  async signup(login, password, firstName, lastName) {
    return new Promise((resolve, reject) => {
      const errors = {
        login: '',
        password: '',
        firstName: '',
        lastName: '',
      };

      let hasErrors = false;

      if (login === '') {
        errors.login = 'Пустое поле логин';
        hasErrors = true;
      }

      if (password === '') {
        errors.password = 'Пустое поле пароль';
        hasErrors = true;
      }

      if (firstName === '') {
        errors.firstName = 'Пустое поле имя';
        hasErrors = true;
      }

      if (lastName === '') {
        errors.lastName = 'Пустое поле фамилия';
        hasErrors = true;
      }

      if (hasErrors) {
        reject(errors);
      } else {
        const connection = mysql.createConnection({
          host: '127.0.0.1',
          user: 'typ99',
          password: '172912qwerty',
          database: 'todo',
        });

        connection.connect((connectError) => {
          if (connectError) {
            reject(connectError);
          } else {
            console.log('Database - OK');
            connection.query(
              'SELECT COUNT (*) AS c FROM users WHERE Login = ?',
              [login],
              (queryError, results, fields) => {
                if (queryError) {
                  reject(queryError);
                } else if (results[0].c === 0) {
                  connection.query(
                    'INSERT INTO users SET ?',
                    {
                      Login: login,
                      Password: hashPassword(password),
                      FirstName: firstName,
                      LastName: lastName,
                    },
                    (secondQueryError, secondResults, secondFields) => {
                      if (secondQueryError) {
                        reject(queryError);
                      } else {
                        resolve(secondResults);
                      }
                      connection.end((endError) => {
                        if (endError) {
                          console.log(endError);
                        } else {
                          console.log('Database - Close');
                        }
                      });
                    },
                  );
                } else {
                  errors.login = 'Данный логин занят';
                  reject(errors);
                }
              },
            );
          }
        });
      }
    });
  }

  async login(login, password) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'typ99',
        password: '172912qwerty',
        database: 'todo',
      });

      connection.connect((connectError) => {
        if (connectError) {
          reject(connectError);
        } else {
          console.log('Database - OK ');
          connection.query(
            'SELECT id_user FROM users WHERE Login = ? and Password = ?',
            [
              login,
              hashPassword(password),
            ],
            (queryError, results, fields) => {
              if (queryError) {
                reject(queryError);
              } else if (results.length === 0) {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject({ message: 'Authentication failed' });
              } else {
                const tokenUser = generateToken(32);
                const idUser = results[0].id_user;
                connection.query(
                  'UPDATE users SET token_user = ? WHERE id_user = ?',
                  [
                    tokenUser,
                    idUser,
                  ],
                  (secondQueryError, secondResults, secondFields) => {
                    if (secondQueryError) {
                      reject(secondQueryError);
                    } else {
                      resolve(tokenUser);
                    }
                    connection.end((endError) => {
                      if (endError) {
                        console.log(endError);
                      } else {
                        console.log('Database - Close');
                      }
                    });
                  },
                );
              }
            },
          );
        }
      });
    });
  }

  async getIdUserByToken(tokenUser) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'typ99',
        password: '172912qwerty',
        database: 'todo',
      });

      connection.query(
        'SELECT id_user FROM users WHERE token_user = ?',
        [
          tokenUser,
        ],
        (queryError, results, fields) => {
          if (queryError) {
            reject(queryError);
          } else {
            resolve(results[0].id_user);
          }
        },
      );
    });
  }

  async logout(tokenUser) {
    const promise = this.getIdUserByToken(tokenUser);
    const idUser = await promise;
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'typ99',
        password: '172912qwerty',
        database: 'todo',
      });

      connection.connect((connectError) => {
        if (connectError) {
          reject(connectError);
        } else {
          console.log('Database - OK');
          connection.query(
            'UPDATE users SET token_user = NULL WHERE id_user = ?',
            [idUser],
            (queryError, results, fields) => {
              if (queryError) {
                reject(queryError);
              } else {
                resolve(results);
              }
              connection.end((endError) => {
                if (endError) {
                  console.log(endError);
                } else {
                  console.log('Database - Close');
                }
              });
            },
          );
        }
      });
    });
  }

  async findAll(tokenUser) {
    const promise = this.getIdUserByToken(tokenUser);
    const idUser = await promise;
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'typ99',
        password: '172912qwerty',
        database: 'todo',
      });

      connection.connect((connectError) => {
        if (connectError) {
          reject(connectError);
        } else {
          console.log('Database - OK');
          connection.query(
            'SELECT id_todo, Title, Description, Status, Finish_date, (CURDATE() > Finish_date) AS overdue FROM todolist WHERE id_user = ?',
            [idUser],
            (queryError, results, fields) => {
              if (queryError) {
                reject(queryError);
              } else {
                resolve(results);
              }
              connection.end((endError) => {
                if (endError) {
                  console.log(endError);
                } else {
                  console.log('Database - Close');
                }
              });
            },
          );
        }
      });
    });
  }

  async findById(idTodo, tokenUser) {
    const promise = this.getIdUserByToken(tokenUser);
    const idUser = await promise;
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'typ99',
        password: '172912qwerty',
        database: 'todo',
      });

      connection.connect((connectError) => {
        if (connectError) {
          reject(connectError);
        } else {
          console.log('Database - OK');
          connection.query('SELECT id_todo, Title, Description, Status, Finish_date FROM todolist WHERE id_todo = ? AND id_user = ?', [idTodo, idUser], (queryError, results, fields) => {
            if (queryError) {
              reject(queryError);
            } else {
              resolve(results);
            }
            connection.end((endError) => {
              if (endError) {
                console.log(endError);
              } else {
                console.log('Database - Close');
              }
            });
          });
        }
      });
    });
  }

  async create(tokenUser, title, description, status, finishDate) {
    const promise = this.getIdUserByToken(tokenUser);
    const idUser = await promise;
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'typ99',
        password: '172912qwerty',
        database: 'todo',
      });

      connection.connect((connectError) => {
        if (connectError) {
          reject(connectError);
        } else {
          console.log('Database - OK');
          connection.query(
            'INSERT INTO todolist SET ?',
            {
              id_user: idUser,
              Title: title,
              Description: description,
              Status: status,
              Finish_date: finishDate,
            },
            (queryError, results, fields) => {
              console.log(queryError);
              if (queryError) {
                reject(queryError);
              } else {
                resolve(results.insertId);
              }
              connection.end((endError) => {
                if (endError) {
                  console.log(endError);
                } else {
                  console.log('Database - Close');
                }
              });
            },
          );
        }
      });
    });
  }

  async update(tokenUser, idTodo, title, description, status, finishDate) {
    const promise = this.getIdUserByToken(tokenUser);
    const idUser = await promise;
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'typ99',
        password: '172912qwerty',
        database: 'todo',
      });

      connection.connect((connectError) => {
        if (connectError) {
          reject(connectError);
        } else {
          console.log('Database - OK');
          connection.query(
            'UPDATE todolist SET Title = ?, Description = ?, Status = ?, Finish_date = ? WHERE id_user = ? AND id_todo = ?',
            [title, description, status, finishDate, idUser, idTodo],
            (queryError, results, fields) => {
              if (queryError) {
                reject(queryError);
              } else {
                resolve(results);
              }
              connection.end((endError) => {
                if (endError) {
                  console.log(endError);
                } else {
                  console.log('Database - Close');
                }
              });
            },
          );
        }
      });
    });
  }

  async remove(tokenUser, idTodo) {
    const promise = this.getIdUserByToken(tokenUser);
    const idUser = await promise;
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'typ99',
        password: '172912qwerty',
        database: 'todo',
      });

      connection.connect((connectError) => {
        if (connectError) {
          reject(connectError);
        } else {
          console.log('Database - OK');
          connection.query('DELETE FROM todolist WHERE id_user = ? AND id_todo = ?', [idUser, idTodo], (queryError, results, fields) => {
            if (queryError) {
              reject(queryError);
            } else {
              resolve(results);
            }
            connection.end((endError) => {
              if (endError) {
                console.log(endError);
              } else {
                console.log('Database - Close');
              }
            });
          });
        }
      });
    });
  }
}

module.exports = {
  Database,
};

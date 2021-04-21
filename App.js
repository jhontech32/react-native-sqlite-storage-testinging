import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button
} from 'react-native'

import SQLite from 'react-native-sqlite-storage'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  userContainer: {
    flexDirection: 'row'
  },
  userInfo: {
    padding: 10
  }
})

class App extends Component {
  state = {
    db: SQLite.openDatabase(
      {
        name: 'TestDB.db',
        // location: 'default',
        createFromLocation: '~www/TestDB.db',
      },
      () => { },
      error => {
        console.log(error);
      }
    ),
    users: []
  }

  componentDidMount () {
    this.getQuery()
    this.insertQuery()
  }

  // componentWillUnmount () {
  //   const { db } = this.state
  //   db.close()
  // }

  // ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
  //   const { db } = this.state

  //   db.transaction((trans) => {
  //     trans.executeSql(sql, params, (trans, results) => {
  //       resolve(results);
  //     },
  //       (error) => {
  //         reject(error);
  //       })
  //   })
  // })

  getQuery = async () => {
    const { db } = this.state
    console.log('dbx', db)

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM test', [], (tx, results) => {
        console.log('tx', tx)
        console.log('results', results.rows.item(2))

        const rows = results.rows
        let users = []

        let row = [...Array(rows.length)]
        row.map((_, index) => (
          users.push({
            ...rows.item(index)
          })
        ))
        this.setState({ users })
      })
    })
  }

  insertQuery = async () => {
    const { db } = this.state

    let Data = {
      id: 7,
      name: "Jhon Doe",
      age: "22",
      email: "jhondoe@gmail.com"
    }

    db.transaction((tx) => {
      tx.executeSql('INSERT INTO test (id, name, age, email) VALUES', [Data.id, Data.name, Data.age, Data.email]).then(([tx, results]) => {
        resolve(results)
        console.log('tx', tx)
        console.log('results', results)
      })
      this.setState({ users: results })
    })
  }

  render () {
    const { users } = this.state
    console.log('users', users)

    return (
      <View style={styles.container}>
        <Button
          title="Sync Data"
          onPress={() => this.getQuery()}
        />

        {
          users.map((item, index) => (
            <View key={index} style={styles.userContainer}>
              <Text style={styles.userInfo}>{item.name}</Text>
              <Text style={styles.userInfo}>{item.email}</Text>
            </View>
          ))
        }
      </View>
    )
  }
}
export default App

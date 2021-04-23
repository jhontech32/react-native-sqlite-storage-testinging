import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ScrollView
} from 'react-native'

import { openDatabase } from 'react-native-sqlite-storage'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingVertical: 10
  },
  userContainer: {
    flexDirection: 'row'
  },
  userInfo: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingTop: 10
  }
})

// global.db = SQLite.openDatabase(
//   {
//     name: 'LuckyDB2.sqlite',
//     createFromLocation: '~www/LuckyDB.sqlite'
//   },
//   () => { alert('success') },
//   error => {
//     console.log(error)
//   }
// )

const db = openDatabase({ name: 'user_db.db', createFromLocation: 1 })

class App extends Component {
  state = {
    users: []
  }


  componentDidMount () {
    this.getQuery()
    // this.insertQuery()
    this.updateQuery()
    // this.deleteQuery()
  }

  // componentWillUnmount () {
  //   db.close()
  // }

  // ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
  //   const { db } = this.state

  //   db.transaction((trans) => {
  //     trans.executeSql(sql, params, (trans, results) => {
  //       resolve(results) 
  //     },
  //       (error) => {
  //         reject(error) 
  //       })
  //   })
  // })

  getQuery = () => new Promise(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tbl_user', [], (_tx, results) => {
        const rows = results.rows
        let users = []

        let row = [...Array(rows.length)]
        row.map((_, index) => (
          users.push({
            ...rows.item(index)
          })
        ))
        console.log('==========> users let', users)
        this.setState({ users })
      })
    })
  })


  insertQuery = () => new Promise(() => {
    let dataku = {
      name: "Kimon",
      age: "22",
      email: "jhondoe323232@gmail.com"
    }

    db.transaction((tx) => {
      tx.executeSql('INSERT INTO tbl_user (name, age, email) VALUES (?, ?, ?)', [dataku.name, dataku.age, dataku.email]),
        (_tx, results) => {
          console.log('Results', results.rowsAffected)
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'You are Registered Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('HomeScreen'),
                },
              ],
              { cancelable: false },
            )
          } else alert('Registration Failed')
        }
      // this.setState({ users: results })
    })
  })

  updateQuery = () => new Promise(() => {
    let dataku = {
      name: 'yamato2',
      age: '29',
      email: 'yamat2o@mail.com'
    }

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE tbl_user SET name=?, age=?, email=? WHERE id = ?',
        [dataku.name, dataku.age, dataku.email, 1],
        (tx, results) => {
          results.rows.length
        },
      )
    })
  })

  deleteQuery = () => new Promise(() => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM tbl_user WHERE id=?', [16], (_tx, results) => {
        resolve(results)
        console.log('Results', results.rowsAffected)
        if (results.rowsAffected > 0) {
          Alert.alert(
            'Success',
            'User deleted Successfully',
            [
              {
                text: 'Ok',
                onPress: () => navigation.navigate('HomeScreen'),
              },
            ],
            { cancelable: false },
          )
        } else alert('Registration Failed')
      })
    })
  })

  render () {
    const { users } = this.state
    console.log('users', users)

    return (
      <View style={styles.container}>
        <Button
          title="Sync Newest Data Now"
          onPress={() => this.getQuery()}
        />

        <ScrollView>
          {
            users.map((item, index) => (
              <View key={index} style={styles.userContainer}>
                <Text style={styles.userInfo}>{item.name}</Text>
                <Text style={styles.userInfo}>{item.email}</Text>
              </View>
            ))
          }
        </ScrollView>
      </View>
    )
  }
}
export default App

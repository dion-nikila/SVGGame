import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Svg, Circle, Rect } from 'react-native-svg';
import { Audio } from 'expo-av';

const Game = () => {
  const [score, setScore] = useState(0);
  const [fallingObjects, setFallingObjects] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        const newObject = {
          type: Math.random() < 0.5 ? 'circle' : 'rect',
          key: Date.now(),
          x: Math.random() * 90,
          y: 0,
          speed: Math.random() * 2 + 1, 
        };
        setFallingObjects(prevObjects => [...prevObjects, newObject]);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameOver]);

  useEffect(() => {
    if (!gameOver) {
      const objectInterval = setInterval(() => {
        setFallingObjects(prevObjects =>
          prevObjects.map(obj => ({
            ...obj,
            y: obj.y + obj.speed,
          }))
        );
      }, 50);

      return () => clearInterval(objectInterval);
    }
  }, [gameOver]);

  const catchObject = async (object) => {
    setScore(prevScore => prevScore + 1);
    setFallingObjects(prevObjects => prevObjects.filter(obj => obj.key !== object.key));
    await playSound(); // Play sound when object is clicked
  };

  useEffect(() => {
    const missObject = fallingObjects.find(obj => obj.y > 100);
    if (missObject) {
      setGameOver(true);
    }
  }, [fallingObjects]);

  const restartGame = () => {
    setScore(0);
    setFallingObjects([]);
    setGameOver(false);
  };

  // Function to play sound effect when an object is clicked
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./beep.mp3')
    );
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%">
        {fallingObjects.map(object => (
          object.type === 'circle' ? (
            <Circle
              key={object.key}
              cx={`${object.x}%`}
              cy={`${object.y}%`}
              r="3%"
              fill="#F4D03F" 
              onPress={() => catchObject(object)}
            />
          ) : (
            <Rect
              key={object.key}
              x={`${object.x}%`}
              y={`${object.y}%`}
              width="6%"
              height="6%"
              fill="#F4D03F" 
              onPress={() => catchObject(object)}
            />
          )
        ))}
      </Svg>
      {gameOver && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOver}>Game Over!</Text>
          <Text style={styles.finalScore}>Final Score: {score}</Text>
          <TouchableOpacity style={styles.button} onPress={restartGame}>
            <Text style={styles.buttonText}>Restart Game</Text>
          </TouchableOpacity>
        </View>
      )}
      {!gameOver && <Text style={styles.score}>Score: {score}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C3E50', 
  },
  score: {
    fontSize: 24,
    marginTop: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  finalScore: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  gameOverContainer: {
    position: 'absolute', 
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
  },
  gameOver: {
    fontSize: 32,
    color: '#E74C3C', 
    marginBottom: 10,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#3498DB', 
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF', 
  },
});

export default Game;

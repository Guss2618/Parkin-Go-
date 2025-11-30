// Arquivo: src/api/auth.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://parkingov2-hgge.onrender.com'; // <-- IMPORTANTE: Use o endereço real do seu backend!

// Armazenamento local simples (substitua por AsyncStorage em produção)
let registeredUsers = [];

// Função para salvar usuários (em produção, use AsyncStorage)
const saveUser = (userData) => {
  registeredUsers.push(userData);
  // Em produção: await AsyncStorage.setItem('users', JSON.stringify(registeredUsers));
};

// Função para buscar usuários (em produção, use AsyncStorage)
const getUsers = () => {
  return registeredUsers;
  // Em produção: const users = await AsyncStorage.getItem('users');
  // return users ? JSON.parse(users) : [];
};

export const registerUser = async (username, email, password) => {
    try {
        // Validação local primeiro
        const users = getUsers();
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            return { success: false, error: 'Este email já está cadastrado.' };
        }

        // Simula chamada à API (comente quando conectar ao backend real)
        // const response = await fetch(`${API_BASE_URL}/auth/register`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         username,
        //         email,
        //         password,
        //     }),
        // });

        // const data = await response.json();

        // if (response.ok) {
        //     return { success: true, user: data.user, token: data.token };
        // } else {
        //     return { success: false, error: data.message || 'Falha no cadastro.' };
        // }

        // Simulação local (remova quando conectar ao backend)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser = {
            id: `user_${Date.now()}`,
            username,
            email,
            password, // Em produção, nunca armazene senha em texto plano!
        };
        
        saveUser(newUser);
        return { success: true, user: newUser };
    } catch (error) {
        console.error("Erro na comunicação com a API de Cadastro:", error);
        return { success: false, error: 'Erro de rede. Verifique sua conexão.' };
    }
};

export const loginUser = async (email, password) => {
    try {
        // Validação local primeiro
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return { 
                success: false, 
                error: 'Email ou senha incorretos. Verifique suas credenciais ou cadastre-se.' 
            };
        }

        // Simula chamada à API (comente quando conectar ao backend real)
        // const response = await fetch(`${API_BASE_URL}/auth/login`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         email,
        //         password,
        //     }),
        // });

        // const data = await response.json();

        // if (response.ok) {
        //     return { success: true, user: data.user, token: data.token };
        // } else {
        //     return { success: false, error: data.message || 'Falha no login.' };
        // }

        // Simulação local (remova quando conectar ao backend)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
        };

        // Salva o usuário logado no AsyncStorage
        await saveLoggedInUser(userData);
        
        return { 
            success: true, 
            user: userData
        };
    } catch (error) {
        console.error("Erro na comunicação com a API de Login:", error);
        return { success: false, error: 'Erro de rede. Verifique sua conexão e tente novamente.' };
    }
};

// Função para salvar usuário logado
export const saveLoggedInUser = async (userData) => {
    try {
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(userData));
    } catch (error) {
        console.error('Erro ao salvar usuário logado:', error);
    }
};

// Função para recuperar usuário logado
export const getLoggedInUser = async () => {
    try {
        const userData = await AsyncStorage.getItem('loggedInUser');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Erro ao recuperar usuário logado:', error);
        return null;
    }
};

// Função para remover usuário logado (logout)
export const removeLoggedInUser = async () => {
    try {
        await AsyncStorage.removeItem('loggedInUser');
    } catch (error) {
        console.error('Erro ao remover usuário logado:', error);
    }
};
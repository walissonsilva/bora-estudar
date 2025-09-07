import React from 'react';
import { View, Text } from 'react-native';

type HeaderProps = {
  username?: string;
  xp?: number;
  maxXp?: number;
};

export const Header = ({ username = 'Estudante', xp = 300, maxXp = 1000 }: HeaderProps) => {
  // Calcula a porcentagem de progresso para a barra de XP
  const progressPercentage = Math.min(100, (xp / maxXp) * 100);

  return (
    <View className="mx-6 mb-8 mt-12">
      {/* Avatar e informações do usuário */}
      <View className="mb-2 flex-row items-center">
        <View className="mr-3 h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-100">
          {/* Placeholder simples em vez de imagem */}
          <Text className="text-xl font-bold text-[#264389]">{username.charAt(0)}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-500">Iniciante</Text>
            <Text className="text-sm text-blue-500">
              {xp}/{maxXp}XP
            </Text>
          </View>
          {/* Barra de progresso */}
          <View className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
            <View
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
        </View>
      </View>

      {/* Saudação */}
      <View className="mt-6">
        <Text className="text-3xl font-bold text-[#1D2B4F]">Olá, {username}!</Text>
        <Text className="mt-1 text-lg text-gray-600">Vamos começar um novo dia de estudos!</Text>
      </View>
    </View>
  );
};

import create from 'zustand';


type UserStoreState = {
  isUserRegistered: boolean;
  setUserRegistered: (value: boolean) => void;
};

const useUserStore = create<UserStoreState>((set) => ({
  isUserRegistered: false,
  setUserRegistered: (value) => set({ isUserRegistered: value }),
}));

export default useUserStore;

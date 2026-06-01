import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UserStore {
  user: {
    profile: {
      name: string;
      settings: {
        theme: string;
        notifications: boolean;
      };
    };
  };
  // 중첩된 데이터의 깊은 곳을 수정하는 액션들입니다.
  updateTheme: (newTheme: string) => void;
  toggleNotifications: () => void;
}

/**
 *  기존 Zustand의 set 함수를 업그레이드하여, 인자로 현재 상태(state) 대신
 *  수정 가능한 초안(Proxy 객체인 draft)을 넘겨주도록 체질을 개선
 */
export const useImmerStore = create<UserStore>()(
  immer((set) => ({
    user: {
      profile: {
        name: "test",
        settings: {
          theme: "light",
          notifications: true,
        },
      },
    },
    updateTheme: (newTheme) => {
      set((draft) => {
        /**
         * draft는 Proxy 객체이므로 직접 대입(=) 명령을 내릴 수 있다.
         * draft.user... 경로를 따라가서 theme 값을 교체하라고 비서에게 지시
         *  Immer 비서는 이 연산을 가로채서 메모해두었다가 함수 종료 시 불변성을 유지한 채 새 객체를 만듬
         */
        draft.user.profile.settings.theme = newTheme;
      });
    },
    toggleNotifications: () => {
      set((draft) => {
        draft.user.profile.settings.notifications =
          !draft.user.profile.settings.notifications;
      });
    },
  })),
);

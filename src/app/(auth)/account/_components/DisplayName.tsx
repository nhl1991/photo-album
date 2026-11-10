import CompleteIcon from "@/components/icons/CompleteIcon";
import EditIcon from "@/components/icons/EditIcon";
import { useAuth } from "@/hooks/useAuth";
import { ChangeEvent, useEffect, useState } from "react";

export default function DisplayName() {
  const [isEdit, setIsEdit] = useState(false); // boolean for Edit Display name.
  const [username, setUsername] = useState<string>("Anonymous");
  const { user, updateUserProfile } = useAuth();
  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => {
    if (user && user.displayName) setUsername(user.displayName);
  }, [user]);

  const handleOnClick = async () => {
    if (username === "") return;
    if (!user) return;
    //Switch to Edit.
    if (isEdit === false) setIsEdit(true);
    else {
      try {
        await updateUserProfile(user, { displayName: username }).then(() => {
          setNotice(null);
        });
      } catch (e) {
        if (e instanceof Error && e.message === "PROFILE_SYNC_FAILED")
          setNotice("저장됐지만 일부 화면에 반영이 늦을 수 있어요.");
        else {
          setNotice("변경에 실패하였습니다. 다시 시도하세요.");
          return;
        }
      }

      if (user.displayName) setUsername(user.displayName);
      setIsEdit(false);
    }
  };

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <div className="w-full min-w-0 flex-1">
      <p className="field-label">표시 이름</p>
      <div
        className={`flex items-center rounded-lg border bg-surface pl-3.5 pr-1 ${isEdit ? "border-accent" : "border-line"}`}
      >
        {isEdit ? (
          <input
            className="min-w-0 flex-1 bg-transparent py-2.5 font-serif text-xl text-ink outline-0"
            type="text"
            value={username}
            placeholder={user?.displayName ? user.displayName : "Anonymous"}
            onChange={onChangeUsername}
          />
        ) : (
          <p className="min-w-0 flex-1 truncate py-2.5 font-serif text-xl text-ink">
            {user?.displayName ? user.displayName : "Anonymous"}
          </p>
        )}

        <button
          id="nickname"
          className="icon-btn"
          onClick={handleOnClick}
          aria-label={isEdit ? "표시 이름 저장" : "표시 이름 수정"}
        >
          {isEdit ? (
            <CompleteIcon className="w-5" />
          ) : (
            <EditIcon className="w-5" />
          )}
        </button>
      </div>
      {notice && <p className="mt-2 text-sm text-red-500">{notice}</p>}
    </div>
  );
}

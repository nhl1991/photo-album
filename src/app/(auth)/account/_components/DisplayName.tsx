import CompleteIcon from "@/components/icons/CompleteIcon";
import EditIcon from "@/components/icons/EditIcon";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile } from "firebase/auth";
import { ChangeEvent, useEffect, useState } from "react";

export default function DisplayName() {
  const [isEdit, setIsEdit] = useState(false); // boolean for Edit Display name.
  const [username, setUsername] = useState<string>("Anonymous");
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.displayName) setUsername(user.displayName);
  }, [user]);

  const handleOnClick = async () => {
    if (username === "") return;
    if (!user) return;
    //Switch to Edit.
    if (isEdit === false) setIsEdit(true);
    else {
      await updateProfile(user, { displayName: username });
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
      <div className={`flex items-center rounded-lg border bg-surface pl-3.5 pr-1 ${isEdit ? "border-accent" : "border-line"}`}>
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

        <button id="nickname" className="icon-btn" onClick={handleOnClick} aria-label={isEdit ? "표시 이름 저장" : "표시 이름 수정"}>
          {isEdit ? (
            <CompleteIcon className="w-5" />
          ) : (
            <EditIcon className="w-5" />
          )}
        </button>
      </div>
    </div>
  );
}

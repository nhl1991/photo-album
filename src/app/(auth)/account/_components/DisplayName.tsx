import CompleteIcon from "@/components/icons/CompleteIcon";
import EditIcon from "@/components/icons/EditIcon";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile } from "firebase/auth";
import { ChangeEvent, useEffect, useState } from "react";

export default function DisplayName() {
  const [isEdit, setIsEdit] = useState(false); // boolean for Edit Display name.
  const [username, setUsername] = useState<string>('Anonymous');
  const { user } = useAuth();
  useEffect(()=>{
    if(user && user.displayName) setUsername(user.displayName);
  },[user])
  const onClick = async () => {
    if(username==="") return;
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
    <div
      className={`flex border-2 rounded-2xl px-1 `}
    >
      {isEdit ? (
        <input
          id="nickname"
          className="w-72 text-2xl px-4 py-1 text-center outline-0 focus:bg-transparent active:bg-transparent"
          type="text"
          placeholder={user?.displayName ? user.displayName : "Anonymous"}
          onChange={onChangeUsername}
        />
      ) : (
        <label
          htmlFor="nickname"
          className="w-max text-2xl px-2 py-1 text-center"
        >
          {user?.displayName ? user.displayName : "Anonymous"}
        </label>
      )}

      <button className="relative w-8 m-1" onClick={onClick}>
        {isEdit ? (
          <CompleteIcon className="w-6" />
        ) : (
          <EditIcon className="w-6" />
        )}
      </button>
    </div>
  );
}

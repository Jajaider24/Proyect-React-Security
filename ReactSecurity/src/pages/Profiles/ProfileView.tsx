import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../interceptors/axiosInterceptor.ts";
import { userService } from "../../services/usersService.ts";
import { profileService } from "../../services/profileService.ts";
import { digitalSignatureService } from "../../services/digitalSignatureService.ts";

type UserLite = { id?: number; name?: string; email?: string };
type ProfileLite = { id?: number; user_id?: number; phone?: string | null; photo?: string | null };

export default function ProfileView() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserLite | null>(null);
  const [profile, setProfile] = useState<ProfileLite | null>(null);
  const [signature, setSignature] = useState<{ photo?: string | null } | null>(null);

  useEffect(() => {
    if (!userId || Number.isNaN(userId)) {
      Swal.fire("Error", "ID de usuario inválido", "error");
      navigate("/users");
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const [u, p, s] = await Promise.all([
          userService.getUserById(userId),
          profileService.getProfileByUser(userId),
          digitalSignatureService.getSignatureByUser(userId),
        ]);
        setUser(u || null);
        setProfile(p || null);
        setSignature(s || null);
      } catch (err: any) {
        console.error(err);
        Swal.fire(
          "Error",
          err?.response?.data?.message || err?.message || "No fue posible cargar el perfil",
          "error"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, navigate]);

  const imageUrl = useMemo(() => {
    // La imagen del perfil debe coincidir con la firma
    const baseURL: string = (api as any)?.defaults?.baseURL || "";
    const raw = (signature as any)?.photo as string | undefined;
    if (!raw) return null;
    const filename = String(raw).split(/[/\\]/).pop();
    if (!filename) return null;
    return `${baseURL}/api/digital-signatures/${filename}`;
  }, [signature]);

  if (loading) return <div className="p-6 text-gray-600">Cargando...</div>;

  return (
    <div className="p-6">
      <div className="rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
        <h1 className="text-3xl font-semibold mb-6 text-black dark:text-white">
          {user?.name || "User"} <span className="font-light">- Profile</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 border border-stroke dark:border-strokedark rounded-md h-[320px] flex items-center justify-center bg-gray-50 dark:bg-gray-800">
            {imageUrl ? (
              <img src={imageUrl} alt="Profile" className="max-h-[300px] object-contain" />
            ) : (
              <div className="w-[260px] h-[260px] border-2 border-dashed border-gray-300 dark:border-gray-600 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  Sin foto
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Name</div>
              <div className="text-black dark:text-white">{user?.name || ""}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
              <div className="text-black dark:text-white">{user?.email || ""}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
              <div className="text-black dark:text-white">{profile?.phone || ""}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

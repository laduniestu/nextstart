import Link from 'next/link';

export default function AdminUserPage() {
  return (
    <div className="flex flex-col">
      <p>Admin User Dashboard</p>
      <Link href="/admin/users/manage">Manage User</Link>
    </div>
  );
}

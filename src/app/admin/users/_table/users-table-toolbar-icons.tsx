// 'use client';

// import type { Table } from '@tanstack/react-table';

// import { UserDelete } from '@/app/admin/users/_form/user-delete';
// import type { UserType } from '@/db/type/users';

// interface UsersTableToolbarActionsProps {
//   table: Table<UserType>;
// }

// export function UsersTableToolbarActions({
//   table,
// }: UsersTableToolbarActionsProps) {
//   return (
//     <div className="flex items-center gap-2">
//       {table.getFilteredSelectedRowModel().rows.length > 0 ? (
//         <>
//           <UserDelete
//             users={table
//               .getFilteredSelectedRowModel()
//               .rows.map((row) => row.original)}
//           />
//         </>
//       ) : null}
//       {/**
//        * Other actions can be added here.
//        * For example, import, view, etc.
//        */}
//     </div>
//   );
// }
// * For example,
// import
// , view, etc.
//        */}
//     </div>
//   )
// }

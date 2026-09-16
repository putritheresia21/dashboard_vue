// import { useConfirm } from 'primevue/useconfirm'

// interface BaseConfirmOptions {
//   message: string
//   header?: string
//   onAccept: () => void
//   onReject?: () => void
// }

// export function useConfirmations() {
//   const confirm = useConfirm()

//   const confirmDelete = ({
//     message,
//     header = 'Konfirmasi Hapus',
//     onAccept,
//     onReject,
//   }: BaseConfirmOptions) => {
//     confirm.require({
//       message,
//       header,
//       icon: 'pi pi-exclamation-triangle',
//       rejectProps: {
//         label: 'Batal',
//         severity: 'secondary',
//         outlined: true,
//       },
//       acceptProps: {
//         label: 'Hapus',
//         severity: 'danger',
//       },
//       accept: onAccept,
//       reject: onReject
//     })
//   }

//   const confirmBulkDelete = (count: number, onAccept: () => void | Promise<void>) => {
//     confirm.require({
//         message: `Yakin ingin menghapus ${count} item terpilih? Aksi ini tidak bisa dibatalkan.`,
//         header: 'Hapus Semua',
//         icon: 'pi pi-exclamation-triangle',
//         rejectProps: {label: 'Batal', severity: 'secondary', outlined: true},
//         acceptProps: {label: `Hapus ${count} Item`, severity: 'danger'},
//         accept: onAccept,
//     })
//   }

//   const confirmAction = ({
//     message,
//     header
//   })
// }

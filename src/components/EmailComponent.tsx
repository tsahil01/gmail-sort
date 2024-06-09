import { useState, useMemo, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { LucideChevronLeft, LucideMailOpen, LucideRefreshCcw, LucideSearch, LucideX } from "lucide-react";

interface Email {
  date: string;
  from: string;
  subject: string;
  classify: string;
  body: string;
}

interface EmailsProps {
  data: Email[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2); // Only take last two digits of the year
  return `${day}/${month}/${year}`;
}

export default function EmailComponent({ data: initialData }: EmailsProps) {
  const [search, setSearch] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<keyof Email>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [data, setData] = useState<Email[]>(initialData);

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.from.toLowerCase().includes(search.toLowerCase()) ||
        item.subject.toLowerCase().includes(search.toLowerCase()) || 
        item.classify.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  const sortedData = useMemo(() => {
    return filteredData.sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSort = (column: keyof Email) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleRefresh = () => {
    // Add your refresh logic here
  };

  const [showCard, setShowCard] = useState<boolean>(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const handleOpenCard = (email: Email) => {
    setSelectedEmail(email);
    setShowCard(true);
  };

  const handleCloseCard = () => {
    setShowCard(false);
    setSelectedEmail(null);
  };

  return (
    <div className="flex flex-col w-full justify-between h-full overflow-auto">
      <header className="p-4 flex items-center justify-between md:px-6">
        <div className="flex items-center gap-4">
          <Button>
            <LucideChevronLeft className="h-5 w-5" />
          </Button>
          <Button>
            <LucideChevronLeft className="h-5 w-5" />
          </Button>
          <div className="relative w-full max-w-md">
            <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" />
            <Input
              type="search"
              placeholder="Search..."
              className="rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Button onClick={handleRefresh}>
          <LucideRefreshCcw className="h-5 w-5" />
        </Button>
      </header>
      <main className="flex-1 overflow-auto p-4md:p-6">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer px-4 py-3 font-bold text-xl"
                  onClick={() => handleSort("date")}
                >
                  Date
                  {sortColumn === "date" && (
                    <span className="ml-2">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer px-4 py-3 font-bold text-xl"
                  onClick={() => handleSort("from")}
                >
                  Sender
                  {sortColumn === "from" && (
                    <span className="ml-2">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer px-4 py-3 font-bold text-xl"
                  onClick={() => handleSort("subject")}
                >
                  Subject
                  {sortColumn === "subject" && (
                    <span className="ml-2">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer px-4 py-3 font-bold text-xl"
                  onClick={() => handleSort("classify")}
                >
                  Classified
                  {sortColumn === "classify" && (
                    <span className="ml-2">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                  )}
                </TableHead>

                <TableHead className="px-4 py-3 font-bold text-xl">Open</TableHead>
              </TableRow>
              </TableHeader>
                  <TableBody>
                    {sortedData.map((item, index) => (
                      <TableRow
                        key={index}
                        className={`border-b border-gray-200 transition-colors duration-300 text-lg`}
                      >
                        <TableCell className="px-4 py-3">{formatDate(item.date)}</TableCell>
                        <TableCell className="px-4 py-3">{item.from}</TableCell>
                        <TableCell className="px-4 py-3">{item.subject}</TableCell>
                        <TableCell className="px-4 py-3">{(item.classify).toLocaleUpperCase()}</TableCell>
                        <TableCell className="px-4 py-3">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenCard(item)}>
                            <LucideMailOpen className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                  </div>
                  </main>
                  {showCard && selectedEmail && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-zinc-900 bg-opacity-50">
                  <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-lg w-full max-w-2xl p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-full">
                      <div className="flex flex-col w-full justify-between">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{selectedEmail.subject}</h3>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">{selectedEmail.classify}</h3>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">From: {selectedEmail.from}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleCloseCard}>
                      <LucideX className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="prose prose-sm prose-gray dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }}></div>
                  </div>
                  </div>
                  </div>
                  )}
                  </div>
                  );
                  }

           

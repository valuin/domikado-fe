"use client";
import { Loader2 } from "lucide-react";
import Index from "./Index";
import { useProvince } from "./hooks/use-province";

const App = () => {
  const { data: provinceData, isLoading } = useProvince({
    provinceId: "3806c593-a4b8-4b6a-9b52-41668a1b007f",
  });

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center">
      <Loader2 className="animate-spin"/>
    </div>;
  }

  return <Index data={provinceData} />;
};

export default App;

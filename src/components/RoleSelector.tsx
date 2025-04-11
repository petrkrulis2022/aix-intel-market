
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users2, ShieldCheck, ShoppingBag } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

const RoleSelector = () => {
  const { setUserRole } = useWallet();

  const roles = [
    {
      id: "worker",
      title: "Agent Worker",
      description: "Perform tasks, record chain of thought, and track resources used",
      icon: <Users2 className="w-10 h-10 text-primary" />,
    },
    {
      id: "validator",
      title: "Agent AIX",
      description: "Validate work, verify resources, and convert to AIX tokens",
      icon: <ShieldCheck className="w-10 h-10 text-secondary" />,
    },
    {
      id: "buyer",
      title: "Agent Buyer",
      description: "Browse marketplace, purchase and use completed work",
      icon: <ShoppingBag className="w-10 h-10 text-green-500" />,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2 gradient-text">Select Your Role</h2>
        <p className="text-muted-foreground max-w-md">
          Choose your agent role to access the appropriate features and dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {roles.map((role) => (
          <Card 
            key={role.id} 
            className="card-gradient border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-70"></div>
            <CardHeader className="pb-2">
              <div className="mb-2">{role.icon}</div>
              <CardTitle>{role.title}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {role.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <CardFooter>
              <Button 
                onClick={() => setUserRole(role.id as any)} 
                className="w-full"
              >
                Select {role.title}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;
